import ACTIONS from '@/console/app-operation/platebatch/store/platebatch-list-actions';
import plateBatchApi from '@/common/api/platebatch-api';
import eventBus from '@/common/utils/event-bus';

const getDefaultState = () => {
    return {
        batches: [],
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
    [ACTIONS.INIT]({commit, dispatch}, appId) {
        commit('resetState');
        return dispatch(ACTIONS.LIST_MY_MANAGED_PLATE_BATCHES, appId);
    },

    [ACTIONS.LIST_MY_MANAGED_PLATE_BATCHES]({commit, state}, appId) {
        let queryCommand = {
            appId: appId,
            search: state.searchTerm,
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            sortedBy: state.sortedBy,
            ascSort: state.ascSort,
        };

        return plateBatchApi.listMyManagedPlateBatches(queryCommand).then((response) => {
            eventBus.$emit('platebatch-list-fetched');
            commit("loadBatches", response.data);
        });
    },
};

const mutations = {
    loadBatches(state, data) {
        state.batches = data.data;
        state.totalNumber = data.totalNumber;
    },

    resetState(state) {
        Object.assign(state, getDefaultState())
    },

    clearSearchTerm(state) {
        state.searchTerm = null;
    },

    updateSearchTerm(state, value) {
        state.searchTerm = value;
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

    renameBatch(state, {batchId, name}) {
        state.batches.find(t => t.id === batchId).name = name;
    },

    deleteBatchById(state, batchId) {
        state.batches = state.batches.filter((t) => {
            return t.id !== batchId;
        });
        state.totalNumber = state.totalNumber - 1;
    },

    updateSorting(state, {sortedBy, ascSort}) {
        state.sortedBy = sortedBy;
        state.ascSort = ascSort;
    },

    resetSorting(state) {
        state.sortedBy = null;
        state.ascSort = false;
        eventBus.$emit('platebatches-sorting-reset');
    },

};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}