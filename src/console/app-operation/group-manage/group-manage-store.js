import Vue from "vue";

function setActiveStatus(allGroups, group, isActive) {
    allGroups[group.id].active = isActive;
    if (!group.children && group.children.length === 0) {
        return;
    }

    for (const child of group.children) {
        setActiveStatus(allGroups, child, isActive);
    }
}

function setArchiveStatus(allGroups, group, isArchived) {
    allGroups[group.id].archived = isArchived;
    if (!group.children && group.children.length === 0) {
        return;
    }

    for (const child of group.children) {
        setArchiveStatus(allGroups, child, isArchived);
    }
}

const getDefaultState = () => {
    return {
        allGroups: {},
        currentGroupId: null,
        currentGroupMemberIds: [],
        currentGroupManagerIds: [],
        departmentSynced: false,

        currentGroupQrs: [],
        batchSelectedQrs: [],
        qrsTotalNumber: 0,
        listQrQuery: {
            search: null,
            pageIndex: 1,
            pageSize: 20,
            sortedBy: null,
            ascSort: false,
        }
    };
};

const state = getDefaultState();

const getters = {
    groupNameOf: (state) => (groupId) => {
        return state.allGroups[groupId].name;
    },

    isGroupActive: (state) => (groupId) => {
        return state.allGroups[groupId].active;
    },

    isGroupArchived: (state) => (groupId) => {
        return state.allGroups[groupId].archived;
    },

    isGroupSynced: (state) => (groupId) => {
        return state.allGroups[groupId].sync;
    },

    isGroupVisible: (state, getters) => (groupId) => {
        return getters.isGroupActive(groupId) && !getters.isGroupArchived(groupId);
    },

    isGroupManager: (state) => (memberId) => {
        return state.currentGroupManagerIds.includes(memberId);
    },

    currentGroupId(state) {
        return state.currentGroupId;
    },

    departmentSynced(state) {
        return state.departmentSynced;
    },

    currentGroupMemberIds(state) {
        return state.currentGroupMemberIds;
    },

    currentGroupManagerIds(state) {
        return state.currentGroupManagerIds;
    },

    listQrQuery(state) {
        return state.listQrQuery;
    },

    currentGroupQrs(state) {
        return state.currentGroupQrs;
    },

    batchSelectedQrs(state) {
        return state.batchSelectedQrs;
    },

    qrsTotalNumber(state) {
        return state.qrsTotalNumber;
    },

    qrsPageSize(state) {
        return state.listQrQuery.pageSize;
    },

    qrsPageIndex(state) {
        return state.listQrQuery.pageIndex;
    },

    qrsSearch(state) {
        return state.listQrQuery.search;
    },
};

const actions = {};

const mutations = {
    resetState(state) {
        Object.assign(state, getDefaultState())
    },

    resetCurrentGroup(state) {
        state.currentGroupId = null;
        state.currentGroupMemberIds = [];
        state.currentGroupManagerIds = [];

        state.currentGroupQrs = [];
        state.batchSelectedQrs = [];
        state.qrsTotalNumber = 0;
        state.listQrQuery = {
            search: null,
            pageIndex: 1,
            pageSize: 20,
            sortedBy: null,
            ascSort: false,
        };
    },

    resetCurrentGroupMembers(state) {
        state.currentGroupMemberIds = [];
        state.currentGroupManagerIds = [];
    },

    resetCurrentGroupQrs(state) {
        state.currentGroupQrs = [];
        state.batchSelectedQrs = [];
        state.qrsTotalNumber = 0;
        state.listQrQuery = {
            search: null,
            pageIndex: 1,
            pageSize: 20,
            sortedBy: null,
            ascSort: false,
        };
    },

    clearCurrentGroupQrs(state) {
        state.batchSelectedQrs = [];
        state.currentGroupQrs = [];
    },

    loadGroupHierarchy(state, {groups, departmentSynced}) {
        state.allGroups = groups;
        state.departmentSynced = departmentSynced;
    },

    addGroup(state, {id, name}) {
        Vue.set(state.allGroups, id, {
            id: id,
            name: name,
            active: true,
            archived: false,
            sync: false
        });
    },

    deleteGroup(state, groupId) {
        Vue.delete(state.allGroups, groupId);
    },

    renameGroup(state, {groupId, name}) {
        state.allGroups[groupId].name = name;
    },

    activateGroupById(state, group) {
        setActiveStatus(state.allGroups, group, true);
    },

    deactivateGroupById(state, group) {
        setActiveStatus(state.allGroups, group, false);
    },

    unArchiveGroupById(state, group) {
        setArchiveStatus(state.allGroups, group, false);
    },

    archiveGroupById(state, group) {
        setArchiveStatus(state.allGroups, group, true);
    },

    setCurrentGroupId(state, groupId) {
        state.currentGroupId = groupId;
    },

    loadCurrentGroupMembers(state, {memberIds, managerIds}) {
        state.currentGroupMemberIds = memberIds;
        state.currentGroupManagerIds = managerIds;
    },

    addMembersToCurrentGroup(state, memberIds) {
        state.currentGroupMemberIds.push(...memberIds);

        //去重
        state.currentGroupMemberIds = state.currentGroupMemberIds.filter((value, index, self) => self.indexOf(value) === index);
    },

    addManagerToCurrentGroup(state, memberId) {
        state.currentGroupManagerIds.push(memberId);
    },

    removeManagerFromGroup(state, memberId) {
        state.currentGroupManagerIds = state.currentGroupManagerIds.filter((id) => {
            return id !== memberId;
        });
    },

    removeMemberFromGroup(state, memberId) {
        state.currentGroupMemberIds = state.currentGroupMemberIds.filter((id) => {
            return id !== memberId;
        });

        state.currentGroupManagerIds = state.currentGroupManagerIds.filter((id) => {
            return id !== memberId;
        });
    },

    loadCurrentGroupQrs(state, data) {
        state.currentGroupQrs = data.data;
        state.qrsTotalNumber = data.totalNumber;
    },

    updateBatchSelectedQrs(state, qrs) {
        state.batchSelectedQrs = qrs;
    },

    resetBatchSelectedQrs(state) {
        state.batchSelectedQrs = [];
    },

    updateSorting(state, {sortedBy, ascSort}) {
        state.listQrQuery.sortedBy = sortedBy;
        state.listQrQuery.ascSort = ascSort;
    },

    resetPageIndex(state) {
        state.listQrQuery.pageIndex = 1;
    },

    updatePageSize(state, pageSize) {
        state.listQrQuery.pageSize = pageSize;
    },

    updatePageIndex(state, pageIndex) {
        state.listQrQuery.pageIndex = pageIndex;
    },

    updateSearch(state, search) {
        state.listQrQuery.search = search;
    },

    addQr(state, qr) {
        state.currentGroupQrs.unshift(qr);
    },

    deleteQrsById(state, qrIds) {
        state.currentGroupQrs = state.currentGroupQrs.filter((qr) => !qrIds.includes(qr.id));
        state.qrsTotalNumber = state.qrsTotalNumber - qrIds.length;
    },

    changeQrsGroup(state, {qrIds, groupId}) {
        state.currentGroupQrs.filter(qr => qrIds.includes(qr.id))
            .forEach(qr => qr.groupId = groupId);
    },

    enableDepartmentSync(state) {
        state.departmentSynced = true;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
