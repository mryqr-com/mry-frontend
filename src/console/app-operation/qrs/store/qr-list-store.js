import qrApi from '@/common/api/qr-api';
import ACTIONS from '@/console/app-operation/qrs/store/qr-list-actions';
import uuid from "short-uuid";
import eventBus from '@/common/utils/event-bus';
import {getCurrentGeopoint} from '@/common/utils/geolocation-utils'
import Vue from "vue";

const defaultState = () => {
    return {
        appId: null,
        groupId: null,
        search: null,
        pageIndex: 1,
        pageSize: 50,
        filterables: new Map(),
        sortedBy: null,
        ascSort: false,
        templateOnly: false,
        inactiveOnly: false,
        nearestPointEnabled: false,
        currentPoint: null,
        startDate: '',
        endDate: '',
        createdBy: 'ALL',

        batchSelectedQrs: [],
        totalNumber: 0,
        attributeValueMap: null,
        qrs: [],
        qrTableBordered: 'false' !== localStorage.qrTableBordered,//列表是否显示边框
        tableKey: uuid.generate(),
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
    }
};

function buildQueryCommand(state) {
    let filterables = {};
    state.filterables.forEach(function (value, key) {
        filterables[key] = value
    });

    return {
        appId: state.appId,
        groupId: state.groupId === 'ALL' ? null : state.groupId,
        search: state.search,
        pageIndex: state.pageIndex,
        pageSize: state.pageSize,
        filterables: filterables,
        sortedBy: state.sortedBy,
        ascSort: state.ascSort,
        templateOnly: state.templateOnly,
        inactiveOnly: state.inactiveOnly,
        nearestPointEnabled: state.nearestPointEnabled,
        currentPoint: state.currentPoint,
        startDate: state.startDate,
        endDate: state.endDate,
        createdBy: state.createdBy === 'ALL' ? null : state.createdBy,
    };
}

const actions = {
    [ACTIONS.LIST_MY_VIEWABLE_QRS]({commit, dispatch, state}) {
        if (state.nearestPointEnabled && !state.currentPoint) {
            return getCurrentGeopoint().then((currentPoint) => {
                commit("updateCurrentPoint", currentPoint);
            }).finally(() => {
                return dispatch("doFetchQrList");
            });
        } else {
            return dispatch("doFetchQrList");
        }
    },

    doFetchQrList({commit, state}) {
        let queryCommand = buildQueryCommand(state);
        return qrApi.listMyViewableQrs(queryCommand).then((response) => {
            commit("loadQrs", response.data);
        });
    },

    [ACTIONS.FETCH_WORKING_QR]({commit, state}) {
        if (state.workingQrId) {
            return qrApi.fetchMyViewableListQr(state.workingQrId).then(response => {
                commit('updateViewableQr', response.data);
                commit('clearWorkingQrId');
            });
        }
    },

    [ACTIONS.FETCH_MY_VIEWABLE_QR]({commit, state}, qrId) {
        setTimeout(() => {
            qrApi.fetchMyViewableListQr(qrId).then(response => {
                commit('updateViewableQr', response.data);
            });
        }, 1000);
    },

    [ACTIONS.EXPORT_TO_EXCEL]({state}) {
        return qrApi.exportQrsToExcel(buildQueryCommand(state));
    },
};

const mutations = {
    resetState(state) {
        Object.assign(state, defaultState())
    },

    initState(state, {appId, groupId}) {
        state.appId = appId;
        state.groupId = groupId;
    },

    updateGroupId(state, groupId) {
        state.groupId = groupId;
    },

    updateSearch(state, search) {
        state.search = search;
    },

    resetSearch(state) {
        state.search = null;
    },

    updatePageIndex(state, pageIndex) {
        state.pageIndex = pageIndex;
    },

    resetPageIndex(state) {
        state.pageIndex = 1;
    },

    updatePageSize(state, pageSize) {
        state.pageSize = pageSize;
    },

    updateFilterables(state, valueMap) {
        state.filterables = new Map([...state.filterables, ...valueMap]);
    },

    clearFilterable(state, key) {
        state.filterables.delete(key);
        state.filterables = new Map([...state.filterables]);
    },

    resetFilterables(state) {
        state.filterables = new Map();
        eventBus.$emit('reset-qrs-filterables');
    },

    updateSorting(state, {sortedBy, ascSort}) {
        state.sortedBy = sortedBy;
        state.ascSort = ascSort;
    },

    resetSorting(state) {
        state.sortedBy = null;
        state.ascSort = false;
        eventBus.$emit('reset-qrs-sorting');
    },

    updateTemplateOnly(state, booleanValue) {
        state.templateOnly = booleanValue;
    },

    resetTemplateOnly(state) {
        state.templateOnly = false;
    },

    updateInactiveOnly(state, booleanValue) {
        state.inactiveOnly = booleanValue;
    },

    resetInactiveOnly(state) {
        state.inactiveOnly = false;
    },

    updateNearestPointEnabled(state, booleanValue) {
        state.nearestPointEnabled = booleanValue;
    },

    resetNearestPointEnabled(state) {
        state.nearestPointEnabled = false;
    },

    updateCurrentPoint(state, point) {
        state.currentPoint = point;
    },

    updateStartEndDate(state, {startDate, endDate}) {
        state.startDate = startDate ? startDate : '';
        state.endDate = endDate ? endDate : '';
    },

    resetStartEndDate(state) {
        state.startDate = '';
        state.endDate = '';
    },

    updateCreatedBy(state, value) {
        state.createdBy = value;
    },

    resetCreatedBy(state) {
        state.createdBy = 'ALL';
    },

    updateBatchSelectedQrs(state, qrs) {
        state.batchSelectedQrs = qrs;
    },

    resetBatchSelectedQrs(state) {
        state.batchSelectedQrs = [];
    },

    updateQrTableBordered(state, isBordered) {
        state.qrTableBordered = isBordered;
        localStorage.qrTableBordered = isBordered;
    },

    renameQrById(state, {qrId, name}) {
        state.qrs.find(t => t.id === qrId).name = name;
    },

    resetQrPlateId(state, {qrId, plateId}) {
        state.qrs.find(t => t.id === qrId).plateId = plateId;
    },

    resetQrCirculationStatus(state, {qrId, optionId}) {
        state.qrs.find(t => t.id === qrId).circulationOptionId = optionId;
    },

    deleteQrById(state, qrId) {
        state.qrs = state.qrs.filter((t) => {
            return t.id !== qrId;
        });
        state.totalNumber = state.totalNumber - 1;
    },

    deleteQrsById(state, qrIds) {
        state.qrs = state.qrs.filter((qr) => {
            return !qrIds.includes(qr.id);
        });
        state.totalNumber = state.totalNumber - qrIds.length;
    },

    markQrAsTemplateById(state, qrId) {
        state.qrs.find(t => t.id === qrId).template = true;
    },

    unmarkQrAsTemplateById(state, qrId) {
        state.qrs.find(t => t.id === qrId).template = false;
    },

    activateQrById(state, qrId) {
        state.qrs.find(t => t.id === qrId).active = true;
    },

    deactivateQrById(state, qrId) {
        state.qrs.find(t => t.id === qrId).active = false;
    },

    loadQrs(state, data) {
        state.qrs = data.data;
        state.totalNumber = data.totalNumber;
        let attributeValueMap = new Map();
        state.qrs.forEach(qr => {
            if (qr.attributeDisplayValues) {
                attributeValueMap.set(qr.id, new Map(Object.entries(qr.attributeDisplayValues)));
            }
        });
        state.attributeValueMap = attributeValueMap;
    },

    //有时字段的增减会使表格错乱，调用此方法可以避免之
    refreshTable(state) {
        state.tableKey = uuid.generate();
    },

    goToTableTop(state) {
        eventBus.$emit('go-to-qrs-table-top');
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