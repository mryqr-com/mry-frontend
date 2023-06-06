import ACTIONS from '@/console/app-operation/submissions/store/submission-list-actions';
import submissionApi from '@/common/api/submission-api';
import uuid from "short-uuid";
import eventBus from '@/common/utils/event-bus';
import Vue from "vue";

const defaultState = () => {
    return {
        appId: null,
        type: null,
        groupId: null,
        qrId: null,
        pageId: null,
        createdBy: 'ALL',
        filterables: new Map(),
        sortedBy: null,
        ascSort: false,
        pageIndex: 1,
        pageSize: 50,
        search: null,
        startDate: '',
        endDate: '',

        submissions: [],
        submissionAnswerMap: null,
        activeSubmissionId: null,
        totalNumber: 0,
        submissionTableBordered: 'false' !== localStorage.submissionTableBordered,//列表是否显示边框
        tableKey: uuid.generate(),
    };
};

const state = defaultState();

const getters = {
    answerOf: (state) => (submissionId, controlId) => {
        let answerMap = state.submissionAnswerMap.get(submissionId);
        if (!answerMap) {
            return null;
        }
        return answerMap.get(controlId);
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
        qrId: state.qrId === 'ALL' ? null : state.qrId,
        createdBy: state.createdBy === 'ALL' ? null : state.createdBy,
        pageId: state.pageId === 'ALL' ? null : state.pageId,
        type: state.type,
        filterables: filterables,
        sortedBy: state.sortedBy,
        ascSort: state.ascSort,
        pageIndex: state.pageIndex,
        pageSize: state.pageSize,
        search: state.search,
        startDate: state.startDate,
        endDate: state.endDate,
    };
}

const actions = {
    [ACTIONS.LIST_SUBMISSIONS]({commit, state}) {
        let queryCommand = buildQueryCommand(state);
        return submissionApi.listSubmissions(queryCommand).then((response) => {
            commit("loadSubmissions", response.data);
        });
    },

    [ACTIONS.EXPORT_TO_EXCEL]({state}) {
        return submissionApi.exportSubmissionsToExcel(buildQueryCommand(state));
    },

    [ACTIONS.RE_FETCH_ACTIVE_SUBMISSION]({commit, state}) {
        if (state.activeSubmissionId) {
            return submissionApi.fetchListSubmission(state.activeSubmissionId).then(response => {
                commit('loadListedSubmission', response.data);
                commit('clearActiveSubmission');
            });
        }
    },

};

const mutations = {
    resetState(state) {
        Object.assign(state, defaultState())
    },

    initState(state, {appId, groupId, qrId, pageId, type}) {
        state.appId = appId;
        state.groupId = groupId;
        state.qrId = qrId;
        state.pageId = pageId;
        state.type = type;
    },

    updateGroupId(state, value) {
        state.groupId = value;
    },

    updatePageId(state, value) {
        state.pageId = value;
    },

    updateCreatedBy(state, value) {
        state.createdBy = value;
    },

    updateFilterables(state, valueMap) {
        state.filterables = new Map([...state.filterables, ...valueMap]);
    },

    resetFilterables(state) {
        state.filterables = new Map();
        eventBus.$emit('reset-submissions-filterables');
    },

    clearFilterable(state, key) {
        state.filterables.delete(key);
        state.filterables = new Map([...state.filterables]);
    },

    updateSorting(state, {sortedBy, ascSort}) {
        state.sortedBy = sortedBy;
        state.ascSort = ascSort;
    },

    resetSorting(state) {
        state.sortedBy = null;
        state.ascSort = false;
        eventBus.$emit('reset-submissions-sorting');
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

    updateSearch(state, value) {
        state.search = value;
    },

    resetSearch(state) {
        state.search = null;
    },

    updateStartEndDate(state, {startDate, endDate}) {
        state.startDate = startDate ? startDate : '';
        state.endDate = endDate ? endDate : '';
    },

    resetStartEndDate(state) {
        state.startDate = '';
        state.endDate = '';
    },

    updateSubmissionTableBordered(state, isBordered) {
        state.submissionTableBordered = isBordered;
        localStorage.submissionTableBordered = isBordered;
    },

    //有时字段的增减会使表格错乱，调用此方法可以避免之
    refreshTable(state) {
        state.tableKey = uuid.generate();
    },

    goToTableTop(state) {
        eventBus.$emit('go-to-submissions-table-top');
    },

    deleteSubmissionById(state, id) {
        state.submissions = state.submissions.filter((t) => {
            return t.id !== id;
        });
        state.totalNumber = state.totalNumber - 1;
    },

    loadSubmissions(state, data) {
        state.submissions = data.data;
        let submissionAnswerMap = new Map();
        state.submissions.forEach(submission => {
            submissionAnswerMap.set(submission.id, new Map(Object.entries(submission.displayAnswers)));
        });
        state.submissionAnswerMap = submissionAnswerMap;
        state.totalNumber = data.totalNumber;
    },

    setActiveSubmission(state, submissionId) {
        state.activeSubmissionId = submissionId;
    },

    clearActiveSubmission(state) {
        state.activeSubmissionId = null;
    },

    loadListedSubmission(state, submission) {
        const index = state.submissions.findIndex(item => item.id === submission.id);
        if (index !== -1) {
            Vue.set(state.submissions, index, submission);
            let submissionAnswerMap = new Map();
            state.submissions.forEach(submission => {
                submissionAnswerMap.set(submission.id, new Map(Object.entries(submission.displayAnswers)));
            });
            state.submissionAnswerMap = submissionAnswerMap;
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