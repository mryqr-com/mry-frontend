import appApi from '@/common/api/app-api';
import ACTIONS from '@/console/management/app/list/store/app-list-actions';
import eventBus from '@/common/utils/event-bus';


const getDefaultState = () => {
    return {
        apps: [],
        searchTerm: null,
        pageIndex: 1,
        pageSize: 20,
        totalNumber: 0,
        sortedBy: null,
        ascSort: false,
    };
};

const state = getDefaultState();

const getters = {};

const actions = {
    [ACTIONS.INIT]({commit, dispatch}) {
        commit('resetState');
        return dispatch(ACTIONS.LIST_MY_MANAGED_APPS);
    },

    [ACTIONS.LIST_MY_MANAGED_APPS]({commit, state}) {
        let queryCommand = {
            search: state.searchTerm,
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            sortedBy: state.sortedBy,
            ascSort: state.ascSort,
        };

        return appApi.listMyManagedApps(queryCommand).then((response) => {
            eventBus.$emit('app-list-fetched');
            commit("loadApps", response.data);
        });
    },
};

const mutations = {
    resetState(state) {
        Object.assign(state, getDefaultState())
    },

    loadApps(state, value) {
        state.apps = value.data;
        state.totalNumber = value.totalNumber;
    },

    updateSearchTerm(state, value) {
        state.searchTerm = value;
    },

    clearSearchTerm(state) {
        state.searchTerm = null;
    },

    resetPageIndex(state) {
        state.pageIndex = 1;
    },

    updatePageIndex(state, value) {
        state.pageIndex = value;
    },

    updatePageSize(state, value) {
        state.pageSize = value;
    },

    deleteAppById(state, appId) {
        state.apps = state.apps.filter((t) => {
            return t.id !== appId;
        });
        state.totalNumber = state.totalNumber - 1;
    },

    renameAppById(state, {appId, name}) {
        state.apps.find(t => t.id === appId).name = name;
    },

    activateAppById(state, appId) {
        state.apps.find(t => t.id === appId).active = true;
    },

    deactivateAppById(state, appId) {
        state.apps.find(t => t.id === appId).active = false;
    },

    lockAppById(state, appId) {
        state.apps.find(t => t.id === appId).locked = true;
    },

    unlockAppById(state, appId) {
        state.apps.find(t => t.id === appId).locked = false;
    },

    updateSorting(state, {sortedBy, ascSort}) {
        state.sortedBy = sortedBy;
        state.ascSort = ascSort;
    },

    resetSorting(state) {
        state.sortedBy = null;
        state.ascSort = false;
        eventBus.$emit('apps-sorting-reset');
    },

};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}