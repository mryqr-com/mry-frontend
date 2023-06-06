import ACTIONS from '@/console/app-operation/assignment/plans/store/assignment-plan-list-actions';
import assignmentPlanApi from '@/common/api/assignment-plan-api';
import uuid from "short-uuid";

const getDefaultState = () => {
    return {
        assignmentPlans: [],
        appId: null,
        groupId: null,
        listKey: uuid.generate(),
    };
};

const state = getDefaultState();

const getters = {
    isAppLevel(state) {
        return !state.groupId;
    },

    isGroupLevel(state) {
        return !!state.groupId;
    },

    isMaxReached(state) {
        return state.assignmentPlans.length >= 5;
    }
};

const actions = {
    [ACTIONS.INIT]({commit, dispatch}, payload) {
        commit('resetState', payload);
        return dispatch(ACTIONS.LIST_ASSIGNMENT_PLANS);
    },

    [ACTIONS.LIST_ASSIGNMENT_PLANS]({commit, state}) {
        return assignmentPlanApi.listAssignmentPlans(state.appId, state.groupId).then((response) => {
            commit("loadAssignmentPlans", response.data);
        });
    },
}

const mutations = {
    loadAssignmentPlans(state, data) {
        state.assignmentPlans = data;
        state.listKey = uuid.generate();
    },

    resetState(state, {appId, groupId}) {
        Object.assign(state, getDefaultState());
        state.appId = appId;
        state.groupId = groupId;
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}