import ACTIONS from '@/console/app-operation/assignment/qrs/store/assignment-qr-list-actions';
import assignmentApi from '@/common/api/assignment-api';
import eventBus from '@/common/utils/event-bus';

const defaultState = () => {
    return {
        assignmentId: null,
        assignmentDetail: null,

        status: 'ALL',
        search: null,
        pageIndex: 1,
        pageSize: 20,
        sortedBy: null,
        ascSort: false,

        qrs: [],
        totalNumber: 0,
        workingQrId: null,
    };
};

const state = defaultState();

const getters = {};

const actions = {
    [ACTIONS.FETCH_ASSIGNMENT_DETAIL]({commit, state}) {
        return assignmentApi.fetchAssignmentDetail(state.assignmentId).then(response => {
            commit("loadAssignmentDetail", response.data);
        });
    },

    [ACTIONS.LIST_ASSIGNMENT_QRS]({commit, state}) {
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
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            sortedBy: state.sortedBy,
            ascSort: state.ascSort,
        };

        return assignmentApi.listAssignmentQrs(state.assignmentId, queryCommand).then((response) => {
            commit("loadAssignmentQrs", response.data);
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

    updateStatus(state, value) {
        state.status = value;
    },

    updateSearch(state, value) {
        state.search = value;
    },

    updateSorting(state, {sortedBy, ascSort}) {
        state.sortedBy = sortedBy;
        state.ascSort = ascSort;
    },

    updatePageIndex(state, value) {
        state.pageIndex = value;
    },

    resetPageIndex(state) {
        state.pageIndex = 1;
    },

    updatePageSize(state, value) {
        state.pageSize = value;
    },

    goToTableTop() {
        eventBus.$emit('go-to-assignment-qrs-table-top');
    },

    loadAssignmentDetail(state, detail) {
        state.assignmentDetail = detail;
    },

    loadAssignmentQrs(state, data) {
        state.qrs = data.data;
        state.totalNumber = data.totalNumber;
    },

    setWorkingQrId(state, qrId) {
        state.workingQrId = qrId;
    },

    clearWorkingQrId(state) {
        state.workingQrId = null;
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