import ACTIONS from '@/console/app-operation/assignment/assignments/store/assignment-list-actions';
import assignmentApi from '@/common/api/assignment-api';
import eventBus from '@/common/utils/event-bus';

const defaultState = () => {
    return {
        appId: null,
        originGroupId: null,
        groupId: null,
        assignmentPlanId: null,
        status: 'ALL',
        operatorId: 'ALL',
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
    [ACTIONS.LIST_ASSIGNMENTS]({commit, state}) {
        let queryCommand = {
            appId: state.appId,
            groupId: state.groupId === 'ALL' ? null : state.groupId,
            assignmentPlanId: state.assignmentPlanId === 'ALL' ? null : state.assignmentPlanId,
            status: state.status === 'ALL' ? null : state.status,
            operatorId: state.operatorId === 'ALL' ? null : state.operatorId,
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            sortedBy: state.sortedBy,
            ascSort: state.ascSort,
        };
        return assignmentApi.listManagedAssignments(queryCommand).then((response) => {
            commit("loadAssignments", response.data);
        });
    },
};

const mutations = {
    resetState(state) {
        Object.assign(state, defaultState())
    },

    initState(state, {appId, originGroupId, groupId, assignmentPlanId}) {
        state.appId = appId;
        state.originGroupId = originGroupId;
        state.groupId = groupId;
        state.assignmentPlanId = assignmentPlanId;
    },

    updateGroupId(state, value) {
        state.groupId = value;
    },

    updateAssignmentPlanId(state, value) {
        state.assignmentPlanId = value;
    },

    updateStatus(state, value) {
        state.status = value;
    },

    updateOperatorId(state, value) {
        state.operatorId = value;
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
        eventBus.$emit('go-to-assignments-table-top');
    },

    deleteAssignmentById(state, id) {
        state.assignments = state.assignments.filter((t) => {
            return t.id !== id;
        });
        state.totalNumber = state.totalNumber - 1;
    },

    loadAssignments(state, data) {
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