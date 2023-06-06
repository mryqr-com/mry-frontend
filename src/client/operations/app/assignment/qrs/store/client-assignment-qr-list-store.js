import ACTIONS from '@/client/operations/app/assignment/qrs/store/client-assignment-qr-list-actions';
import assignmentApi from '@/common/api/assignment-api';
import uuid from "short-uuid";
import {getCurrentGeopoint} from "@/common/utils/geolocation-utils";
import {Message} from "element-ui";

const defaultState = () => {
    return {
        assignmentId: null,
        assignmentDetail: null,

        status: 'ALL',
        search: null,
        nearestPointEnabled: false,
        currentPoint: null,
        pageIndex: 1,
        sortedBy: null,
        ascSort: false,

        qrs: [],
        infiniteKey: 0,
        keepStateKey: 0,
        workingQrId: 0,
    };
};

const state = defaultState();

const getters = {
    hasFilter(state) {
        return state.search || state.sortedBy;
    },
};

const actions = {
    [ACTIONS.FETCH_ASSIGNMENT_DETAIL]({commit, state}) {
        return assignmentApi.fetchAssignmentDetail(state.assignmentId).then(response => {
            commit("loadAssignmentDetail", response.data);
        });
    },

    [ACTIONS.LIST_ASSIGNMENT_QRS]({commit, dispatch, state}, infiniteState) {
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
        let finished;
        switch (state.status) {
            case 'ALL': {
                finished = null;
                break;
            }
            case 'FINISHED': {
                finished = true;
                break;
            }
            case 'UNFINISHED': {
                finished = false;
            }
        }

        let queryCommand = {
            finished: finished,
            search: state.search,
            nearestPointEnabled: state.nearestPointEnabled,
            currentPoint: state.currentPoint,
            pageIndex: state.pageIndex,
            pageSize: 20,
            sortedBy: state.sortedBy,
            ascSort: state.ascSort,
        };

        return assignmentApi.listAssignmentQrs(state.assignmentId, queryCommand, {showLoading: false}).then((response) => {
            let payload = {
                infiniteState: infiniteState,
                data: response.data
            }

            commit("loadAssignmentQrs", payload);
        });
    },

    [ACTIONS.FETCH_ASSIGNMENT_QR_DETAIL]({commit, state}) {
        if (state.workingQrId) {
            return assignmentApi.fetchAssignmentQrDetail(state.assignmentId, state.workingQrId).then(response => {
                commit('updateAssignmentQr', response.data);
                commit('clearWorkingQrId');
            });
        }
    },
};

const mutations = {
    resetState(state) {
        Object.assign(state, defaultState())
    },

    initState(state, {assignmentId}) {
        state.assignmentId = assignmentId;
    },

    resetInfinite(state) {
        state.qrs = [];
        state.pageIndex = 1;
        state.infiniteKey = uuid.generate();
    },

    refreshKeepStateKey(state) {
        state.keepStateKey = uuid.generate();
    },

    updateStatus(state, value) {
        state.status = value;
    },

    resetStatus(state) {
        state.status = 'ALL';
    },

    updateSearch(state, value) {
        state.search = value;
    },

    resetSearch(state) {
        state.search = null;
    },

    updateSortedBy(state, value) {
        state.sortedBy = value;
    },

    updateAscSort(state, value) {
        state.ascSort = value;
    },

    resetSorting(state) {
        state.sortedBy = null;
        state.ascSort = false;
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

    setWorkingQrId(state, qrId) {
        state.workingQrId = qrId;
    },

    clearWorkingQrId(state) {
        state.workingQrId = null;
    },

    loadAssignmentDetail(state, detail) {
        state.assignmentDetail = detail;
    },

    loadAssignmentQrs(state, payload) {
        let qrs = payload.data.data;
        let infiniteState = payload.infiniteState;

        //删除重复的原有qr
        let qrIds = qrs.map(qr => qr.id);
        state.qrs = state.qrs.filter((qr) => {
            return !qrIds.includes(qr.id);
        });

        if (qrs.length) {
            state.qrs.push(...qrs);
            infiniteState.loaded();
        }

        if (qrs.length >= payload.data.pageSize) {
            state.pageIndex = state.pageIndex + 1;
        } else {
            infiniteState.complete();
        }
    },

    updateAssignmentQr(state, qr) {
        state.assignmentDetail.status = qr.status;
        state.assignmentDetail.allQrCount = qr.allQrCount;
        state.assignmentDetail.finishedQrCount = qr.finishedQrCount;

        let existingQr = state.qrs.find(item => item.id === qr.qrId);
        if (existingQr) {
            existingQr.finished = qr.finished;
            existingQr.submissionId = qr.submissionId;
            existingQr.operatorId = qr.operatorId;
            existingQr.operatorName = qr.operatorName;
            existingQr.finishedAt = qr.finishedAt;
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