import ACTIONS from '@/client/qr/submissions/store/qr-submission-list-actions';
import submissionApi from '@/common/api/submission-api';
import uuid from "short-uuid";
import Vue from "vue";
import qrApi from '@/common/api/qr-api';

const defaultState = () => {
    return {
        qrId: null,
        type: null,
        originPageId: null,
        pageId: null,
        createdBy: 'ALL',
        filterables: new Map(),
        sortedBy: null,
        ascSort: false,
        pageIndex: 1,
        search: null,
        startDate: null,
        endDate: null,

        submissions: [],
        submissionAnswerMap: null,
        infiniteKey: 0,
        keepStateKey: 0,//trick：微信中返回后有些控件的值不再显示了
        activeSubmissionId: null,
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
    },

    hasFilter(state) {
        return (state.originPageId === 'ALL' && state.pageId !== 'ALL') ||
            (state.type !== 'SUBMITTER_SUBMISSION' && state.createdBy !== 'ALL') ||
            [...state.filterables.values()].some(value => value && value.length > 0) ||
            state.sortedBy ||
            state.startDate ||
            state.endDate;
    }
};

const actions = {
    [ACTIONS.LIST_QR_SUBMISSIONS]({commit, state}, infiniteState) {
        let filterables = {};
        state.filterables.forEach(function (value, key) {
            filterables[key] = value
        });

        let queryCommand = {
            type: state.type,
            pageId: state.pageId === 'ALL' ? null : state.pageId,
            createdBy: state.createdBy === 'ALL' ? null : state.createdBy,
            filterables: filterables,
            sortedBy: state.sortedBy,
            ascSort: state.ascSort,
            pageIndex: state.pageIndex,
            pageSize: 30,
            search: state.search,
            startDate: state.startDate,
            endDate: state.endDate,
        };

        return qrApi.listQrSubmissions(state.qrId, queryCommand).then((response) => {
            let payload = {
                infiniteState: infiniteState,
                data: response.data
            }
            commit("loadSubmissions", payload);
        });
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

    initState(state, {qrId, pageId, type}) {
        state.qrId = qrId;
        state.pageId = pageId;
        state.originPageId = pageId;
        state.type = type;
    },

    refreshKeepStateKey(state) {
        state.keepStateKey = uuid.generate();
    },

    resetInfinite(state) {
        state.submissions = [];
        state.pageIndex = 1;
        state.submissionAnswerMap = null;
        state.infiniteKey = uuid.generate();
    },

    updatePageId(state, value) {
        state.pageId = value;
    },

    resetPageId(state) {
        state.pageId = state.originPageId;
    },

    updateCreatedBy(state, value) {
        state.createdBy = value;
    },

    resetCreatedBy(state) {
        state.createdBy = 'ALL';
    },

    updateFilterables(state, valueMap) {
        state.filterables = new Map([...state.filterables, ...valueMap]);
    },

    resetFilterables(state) {
        state.filterables = new Map();
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

    updateSearch(state, value) {
        state.search = value;
    },

    resetSearch(state) {
        state.search = null;
    },

    updateStartDate(state, startDate) {
        state.startDate = startDate;
    },

    resetStartDate(state) {
        state.startDate = null;
    },

    updateEndDate(state, endDate) {
        state.endDate = endDate;
    },

    resetEndDate(state) {
        state.endDate = null;
    },

    deleteSubmissionById(state, id) {
        state.submissions = state.submissions.filter((t) => {
            return t.id !== id;
        });
    },

    loadSubmissions(state, payload) {
        let submissions = payload.data.data;
        let infiniteState = payload.infiniteState;

        //删除重复的原有submission
        let submissionIds = submissions.map(submission => submission.id);
        state.submissions = state.submissions.filter((submission) => {
            return !submissionIds.includes(submission.id);
        });

        if (submissions.length) {
            state.submissions.push(...submissions);
            let submissionAnswerMap = new Map();
            state.submissions.forEach(submission => {
                submissionAnswerMap.set(submission.id, new Map(Object.entries(submission.displayAnswers)));
            });
            state.submissionAnswerMap = submissionAnswerMap;
            infiniteState.loaded();
        }

        if (submissions.length >= payload.data.pageSize) {
            state.pageIndex = state.pageIndex + 1;
        } else {
            infiniteState.complete();
        }
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