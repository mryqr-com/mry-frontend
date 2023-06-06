import ACTIONS from '@/console/app-operation/assignment/my-assignments/store/my-assignment-list-actions';
import assignmentApi from '@/common/api/assignment-api';
import eventBus from '@/common/utils/event-bus';

const defaultState = () => {
    return {
        appId: null,
        groupId: null,
        originGroupId: null,
        status: 'ALL',
        pageIndex: 1,
        pageSize: 20,
        sortedBy: null,
        ascSort: false,

        assignments: [],
        totalNumber: 0,
    };
};

const state = defaultState();

const getters = {};

const actions = {
    [ACTIONS.LIST_MY_ASSIGNMENTS]({commit, state}) {
        let queryCommand = {
            appId: state.appId,
            groupId: state.groupId === 'ALL' ? null : state.groupId,
            status: state.status === 'ALL' ? null : state.status,
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            sortedBy: state.sortedBy,
            ascSort: state.ascSort,
        };
        return assignmentApi.listMyAssignments(queryCommand).then((response) => {
            commit("loadMyAssignments", response.data);
        });
    },
};

const mutations = {
    resetState(state) {
        Object.assign(state, defaultState())
    },

    initState(state, {appId, groupId, originGroupId}) {
        state.appId = appId;
        state.groupId = groupId;
        state.originGroupId = originGroupId;
    },

    updateGroupId(state, value) {
        state.groupId = value;
    },

    updateStatus(state, value) {
        state.status = value;
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
        eventBus.$emit('go-to-my-assignments-table-top');
    },

    loadMyAssignments(state, data) {
        state.assignments = data.data;
        state.totalNumber = data.totalNumber;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}