const defaultState = () => {
    return {
        editMode: false,
        saved: true,
        reports: new Map(),
    }
}

const state = defaultState();

const getters = {
    isEditMode(state) {
        return state.editMode;
    },

    isSaved(state) {
        return state.saved;
    },
};

const actions = {};

const mutations = {
    resetState(state) {
        Object.assign(state, defaultState())
    },

    enterEditMode(state) {
        state.editMode = true;
        state.saved = true;
    },

    exitEditMode(state) {
        state.editMode = false;
        state.saved = true;
    },

    markUnsaved(state) {
        state.saved = false;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}