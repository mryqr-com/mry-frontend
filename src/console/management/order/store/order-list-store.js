import ACTIONS from '@/console/management/order/store/order-list-actions';
import orderApi from '@/common/api/order-api';
import eventBus from '@/common/utils/event-bus';

const getDefaultState = () => {
    return {
        orders: [],
        searchTerm: null,
        pageIndex: 1,
        pageSize: 20,
        totalNumber: 0,
    };
};

const state = getDefaultState();

const getters = {};

const actions = {
    [ACTIONS.INIT]({commit, dispatch}) {
        commit('resetState');
        return dispatch(ACTIONS.LIST_ORDERS);
    },

    [ACTIONS.LIST_ORDERS]({commit, state}) {
        let queryCommand = {
            search: state.searchTerm,
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
        };

        return orderApi.listOrders(queryCommand).then((response) => {
            eventBus.$emit('order-list-fetched');
            commit("loadOrders", response.data);
        });
    },
};

const mutations = {
    resetState(state) {
        Object.assign(state, getDefaultState())
    },

    loadOrders(state, value) {
        state.orders = value.data;
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
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}