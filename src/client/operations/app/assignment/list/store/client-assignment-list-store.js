import ACTIONS from '@/client/operations/app/assignment/list/store/client-assignment-list-actions';
import assignmentApi from '@/common/api/assignment-api';
import uuid from "short-uuid";

const defaultState = () => {
    return {
        appId: null,
        originGroupId: null,
        initGroupId: null,

        groupId: null,
        assignmentPlanId: 'ALL',
        status: 'ALL',
        operatorId: 'ALL',
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
            state.assignmentPlanId !== 'ALL' ||
            state.operatorId !== 'ALL' ||
            state.sortedBy;
    },
};

const actions = {
    [ACTIONS.LIST_ASSIGNMENTS]({commit, state}, infiniteState) {
        let queryCommand = {
            appId: state.appId,
            groupId: state.groupId === 'ALL' ? null : state.groupId,
            assignmentPlanId: state.assignmentPlanId === 'ALL' ? null : state.assignmentPlanId,
            status: state.status === 'ALL' ? null : state.status,
            operatorId: state.operatorId === 'ALL' ? null : state.operatorId,
            pageIndex: state.pageIndex,
            pageSize: 20,
            sortedBy: state.sortedBy,
            ascSort: state.ascSort,
        };
        return assignmentApi.listManagedAssignments(queryCommand, {showLoading: false}).then((response) => {
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

    updateAssignmentPlanId(state, value) {
        state.assignmentPlanId = value;
    },

    resetAssignmentPlanId(state) {
        state.assignmentPlanId = 'ALL';
    },

    updateStatus(state, value) {
        state.status = value;
    },

    resetStatus(state) {
        state.status = 'ALL';
    },

    updateOperatorId(state, value) {
        state.operatorId = value;
    },

    resetOperatorId(state) {
        state.operatorId = 'ALL';
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

    deleteAssignmentById(state, id) {
        state.assignments = state.assignments.filter((t) => {
            return t.id !== id;
        });
    },

    setAssignmentOperators(state, {assignmentId, members}) {
        let assignment = state.assignments.find(assignment => assignment.id === assignmentId);
        assignment.operators = members.map(member => member.id);
        assignment.operatorNames = members.map(member => member.showName);
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