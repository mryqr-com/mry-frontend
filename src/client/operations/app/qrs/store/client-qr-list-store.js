import qrApi from '@/common/api/qr-api';
import ACTIONS from '@/client/operations/app/qrs/store/client-qr-list-actions';
import {getCurrentGeopoint} from '@/common/utils/geolocation-utils'

import uuid from "short-uuid";
import {Message} from 'element-ui';
import Vue from "vue";

const defaultState = () => {
    return {
        originGroupId: null,
        initGroupId: null,
        appId: null,
        groupId: null,
        pageIndex: 1,
        search: null,
        filterables: new Map(),
        nearestPointEnabled: false,
        currentPoint: null,
        sortedBy: null,
        ascSort: false,
        inactiveOnly: false,
        templateOnly: false,

        qrs: [],
        attributeValueMap: null,
        infiniteKey: 0,
        keepStateKey: 0,//trick：微信中返回后有些控件的值不再显示了
        workingQrId: null,
    };
};

const state = defaultState();

const getters = {
    attributeValueOf: (state) => (qrId, attributeId) => {
        let valueMap = state.attributeValueMap.get(qrId);
        if (!valueMap) {
            return null;
        }
        return valueMap.get(attributeId);
    },

    hasFilter(state) {
        return (state.initGroupId === 'ALL' && state.groupId !== 'ALL') ||
            [...state.filterables.values()].some(value => value && value.length > 0) ||
            state.inactiveOnly ||
            state.templateOnly ||
            state.sortedBy;
    },
};

const actions = {
    [ACTIONS.CLIENT_LIST_MY_VIEWABLE_QRS]({commit, dispatch, state}, infiniteState) {
        if (state.nearestPointEnabled && !state.currentPoint) {
            return getCurrentGeopoint().then((currentPoint) => {
                commit("updateCurrentPoint", currentPoint);
            }).catch(e => {
                Message.error({
                    type: 'error',
                    message: '无法定位当前位置。',
                    center: true,
                    duration: 1000,
                });
                commit("resetNearestPointEnabled");
            }).finally(() => {
                return dispatch("doFetchQrList", infiniteState);
            });
        } else {
            return dispatch("doFetchQrList", infiniteState);
        }
    },

    doFetchQrList({commit, state}, infiniteState) {
        let filterables = {};
        state.filterables.forEach(function (value, key) {
            filterables[key] = value
        });

        let queryCommand = {
            appId: state.appId,
            groupId: state.groupId === 'ALL' ? null : state.groupId,
            search: state.search,
            pageIndex: state.pageIndex,
            pageSize: 30,
            filterables: filterables,
            inactiveOnly: state.inactiveOnly,
            templateOnly: state.templateOnly,
            sortedBy: state.sortedBy,
            ascSort: state.ascSort,
            nearestPointEnabled: state.nearestPointEnabled,
            currentPoint: state.currentPoint,
        };

        return qrApi.listMyViewableQrs(queryCommand, {showLoading: false}).then((response) => {
            let payload = {
                infiniteState: infiniteState,
                data: response.data
            }
            commit("loadQrs", payload);
        });
    },

    [ACTIONS.CLIENT_FETCH_WORKING_QR]({commit, state}) {
        if (state.workingQrId) {
            return qrApi.fetchMyViewableListQr(state.workingQrId).then(response => {
                commit('updateViewableQr', response.data);
                commit('clearWorkingQrId');
            });
        }
    },

    [ACTIONS.CLIENT_FETCH_MY_VIEWABLE_QR]({commit, state}, qrId) {
        setTimeout(() => {
            qrApi.fetchMyViewableListQr(qrId).then(response => {
                commit('updateViewableQr', response.data);
            });
        }, 1000);
    },

};

const mutations = {
    resetState(state) {
        Object.assign(state, defaultState())
    },

    initState(state, {appId, originGroupId, groupId, initFilterables}) {
        state.appId = appId;
        state.originGroupId = originGroupId;
        state.initGroupId = groupId;
        state.groupId = groupId;
        state.filterables = initFilterables;
    },

    updateGroupId(state, groupId) {
        state.groupId = groupId;
    },

    resetGroupId(state) {
        state.groupId = state.initGroupId;
    },

    updateSearch(state, search) {
        state.search = search;
    },

    resetSearch(state) {
        state.search = null;
    },

    updateSortedBy(state, sortedBy) {
        state.sortedBy = sortedBy;
    },

    updateAscSort(state, ascSort) {
        state.ascSort = ascSort;
    },

    updateInactiveOnly(state, booleanValue) {
        state.inactiveOnly = booleanValue;
    },

    resetInactiveOnly(state) {
        state.inactiveOnly = false;
    },

    updateTemplateOnly(state, booleanValue) {
        state.templateOnly = booleanValue;
    },

    resetTemplateOnly(state) {
        state.templateOnly = false;
    },

    updateNearestPointEnabled(state, value) {
        state.nearestPointEnabled = value;
    },

    resetNearestPointEnabled(state) {
        state.nearestPointEnabled = false;
    },

    updateCurrentPoint(state, point) {
        state.currentPoint = point;
    },

    deleteQrById(state, qrId) {
        state.qrs = state.qrs.filter((t) => {
            return t.id !== qrId;
        });
    },

    renameQrById(state, {qrId, name}) {
        state.qrs.find(t => t.id === qrId).name = name;
    },

    changeQrGroupById(state, {qrId, newGroupId}) {
        state.qrs.find(t => t.id === qrId).groupId = newGroupId;
    },

    loadQrs(state, payload) {
        let qrs = payload.data.data;
        let infiniteState = payload.infiniteState;

        //删除重复的原有qr
        let qrIds = qrs.map(qr => qr.id);
        state.qrs = state.qrs.filter((qr) => {
            return !qrIds.includes(qr.id);
        });

        if (qrs.length) {
            state.qrs.push(...qrs);
            let attributeValueMap = new Map();
            state.qrs.forEach(qr => {
                if (qr.attributeDisplayValues) {
                    attributeValueMap.set(qr.id, new Map(Object.entries(qr.attributeDisplayValues)));
                }
            });
            state.attributeValueMap = attributeValueMap;
            infiniteState.loaded();
        }

        if (qrs.length >= payload.data.pageSize) {
            state.pageIndex = state.pageIndex + 1;
        } else {
            infiniteState.complete();
        }
    },

    resetInfinite(state) {
        state.qrs = [];
        state.pageIndex = 1;
        state.attributeValueMap = null;
        state.infiniteKey = uuid.generate();
    },

    refreshKeepStateKey(state) {
        state.keepStateKey = uuid.generate();
    },

    updateFilterables(state, valueMap) {
        state.filterables = new Map([...state.filterables, ...valueMap]);
    },

    resetFilters(state) {
        state.sortedBy = null;
        state.ascSort = false;
        state.filterables = new Map();
        state.templateOnly = false;
        state.inactiveOnly = false;
    },

    setWorkingQrId(state, qrId) {
        state.workingQrId = qrId;
    },

    clearWorkingQrId(state) {
        state.workingQrId = null;
    },

    updateViewableQr(state, qr) {
        const index = state.qrs.findIndex(item => item.id === qr.id);
        if (index !== -1) {
            Vue.set(state.qrs, index, qr);
            let attributeValueMap = new Map();
            state.qrs.forEach(qr => {
                if (qr.attributeDisplayValues) {
                    attributeValueMap.set(qr.id, new Map(Object.entries(qr.attributeDisplayValues)));
                }
            });
            state.attributeValueMap = attributeValueMap;
        }
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}