import ACTIONS from '@/client/operations/app/assignment/mine/store/client-my-assignment-list-actions';
import assignmentApi from '@/common/api/assignment-api';
import uuid from "short-uuid";

const defaultState = () => {
    return {
        appId: null,
        originGroupId: null,
        initGroupId: null,

        groupId: null,
        status: 'ALL',
        pageIndex: 1,
        sortedBy: null,
        ascSort: false,

        assignments: [],
        infiniteKey: 0,
    };
};

const state = defaultState();

const getters = {
    hasFilter(state) {
        return (state.initGroupId === 'ALL' && state.groupId !== 'ALL') ||
            state.sortedBy;
    },
};

const actions = {
    [ACTIONS.LIST_ASSIGNMENTS]({commit, state}, infiniteState) {
        let queryCommand = {
            appId: state.appId,
            groupId: state.groupId === 'ALL' ? null : state.groupId,
            status: state.status === 'ALL' ? null : state.status,
            pageIndex: state.pageIndex,
            pageSize: 20,
            sortedBy: state.sortedBy,
            ascSort: state.ascSort,
        };
        return assignmentApi.listMyAssignments(queryCommand, {showLoading: false}).then((response) => {
            let payload = {
                infiniteState: infiniteState,
                data: response.data
            }

            commit("loadAssignments", payload);
        });
    },
};

const mutations = {
    resetState(state) {
        Object.assign(state, defaultState())
    },

    initState(state, {appId, originGroupId, groupId}) {
        state.appId = appId;
        state.originGroupId = originGroupId;
        state.initGroupId = groupId;
        state.groupId = groupId;
    },

    resetInfinite(state) {
        state.assignments = [];
        state.pageIndex = 1;
        state.infiniteKey = uuid.generate();
    },

    updateGroupId(state, value) {
        state.groupId = value;
    },

    resetGroupId(state) {
        state.groupId = state.initGroupId;
    },

    updateStatus(state, value) {
        state.status = value;
    },

    resetStatus(state) {
        state.status = 'ALL';
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

    loadAssignments(state, payload) {
        let assignments = payload.data.data;
        let infiniteState = payload.infiniteState;

        //删除重复的原有assignments
        let assignmentIds = assignments.map(assignment => assignment.id);
        state.assignments = state.assignments.filter((assignment) => {
            return !assignmentIds.includes(assignment.id);
        });

        if (assignments.length) {
            state.assignments.push(...assignments);
            infiniteState.loaded();
        }

        if (assignments.length >= payload.data.pageSize) {
            state.pageIndex = state.pageIndex + 1;
        } else {
            infiniteState.complete();
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