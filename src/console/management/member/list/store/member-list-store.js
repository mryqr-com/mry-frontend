import Vue from "vue";
import ACTIONS from '@/console/management/member/list/store/member-list-actions';
import memberApi from '@/common/api/member-api';
import eventBus from '@/common/utils/event-bus';

function buildDepartmentFullNameMap(departmentData, allDepartments) {
    let listOfMap = departmentData.map(dept => {
        return buildDeptFullNames(dept, allDepartments);
    });

    let result = new Map();
    listOfMap.forEach(it => it.forEach((value, key) => result.set(key, value)))
    return result;
}

function buildDeptFullNames(dept, allDepartments) {
    let result = new Map();
    result.set(dept.id, allDepartments[dept.id].name);

    if (!dept.children || dept.children.length === 0) {
        return result;
    }

    dept.children.forEach(child => {
        let map = buildDeptFullNames(child, allDepartments);
        map.forEach((value, key) => result.set(key, allDepartments[dept.id].name + '/' + value));
    });

    return result;
}

function removeDepartmentRecursively(department, members, allDepartments) {
    members.forEach(member => {
        member.departmentIds.splice(member.departmentIds.findIndex(id => id === department.id), 1);
    });

    Vue.delete(allDepartments, department.id);

    if (!department.children || department.children.length === 0) {
        return;
    }
    department.children.forEach(child => removeDepartmentRecursively(child, members, allDepartments));
}

const getDefaultState = () => {
    return {
        departmentData: {},//从department tree那边同步而来
        allDepartments: {},//map: id -> dept
        currentDepartmentId: 'ALL',

        members: [],
        searchTerm: null,
        sortedBy: null,
        ascSort: false,
        pageIndex: 1,
        pageSize: 30,
        totalNumber: 0
    };
};

const state = getDefaultState();

const getters = {
    currentDepartment(state) {
        return state.allDepartments[state.currentDepartmentId];
    },

    departmentFullNamesMap(state) {
        return buildDepartmentFullNameMap(state.departmentData, state.allDepartments);
    },

    departmentNameOf: (state) => (id) => {
        return state.allDepartments[id].name;
    },

    departmentFullNameOf: (state, getters) => (id) => {
        return getters.departmentFullNamesMap.get(id);
    },

    departments(state, getters) {
        let result = [];
        getters.departmentFullNamesMap.forEach((value, key) => result.push({id: key, name: value}));
        return result;
    },

    isCurrentDepartmentManager: (state, getters) => (memberId) => {
        if (!getters.currentDepartment) {
            return false;
        }

        return getters.currentDepartment.managers.includes(memberId);
    },
};

const actions = {
    [ACTIONS.LIST_MY_MANAGED_MEMBERS]({commit, state}) {
        let query = {
            departmentId: state.currentDepartmentId !== 'ALL' ? state.currentDepartmentId : null,
            search: state.searchTerm,
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            sortedBy: state.sortedBy,
            ascSort: state.ascSort,
        };
        return memberApi.listMyManagedMembers(query).then((response) => {
            eventBus.$emit('member-list-fetched');
            commit("loadMembers", response.data);
        });
    },
};

const mutations = {
    loadDepartmentHierarchy(state, {departmentData, allDepartments}) {
        state.departmentData = departmentData;
        state.allDepartments = allDepartments;
    },

    updateDepartmentData(state, departmentData) {
        state.departmentData = departmentData;
    },

    unbindWx(state, id) {
        let member = state.members.find(m => m.id === id);
        member.wxUnionId = null;
        member.wxNickName = null;
    },

    deleteMember(state, memberId) {
        state.members = state.members.filter((t) => {
            return t.id !== memberId;
        });
        state.totalNumber = state.totalNumber - 1;
    },

    deactivateMember(state, memberId) {
        let member = state.members.find(m => m.id === memberId);
        member.active = false;
    },

    activateMember(state, memberId) {
        let member = state.members.find(m => m.id === memberId);
        member.active = true;
    },

    updateMemberDetailById(state, {id, name, departmentIds, mobile, email}) {
        let member = state.members.find(m => m.id === id);
        member.name = name;
        member.departmentIds = departmentIds;
        member.mobile = mobile;
        member.email = email;
    },

    updateMemberRoleById(state, {id, role}) {
        let member = state.members.find(m => m.id === id);
        member.role = role;
    },

    loadMembers(state, data) {
        state.members = data.data;
        state.totalNumber = data.totalNumber;
    },

    resetState(state) {
        Object.assign(state, getDefaultState())
    },

    clearSearchTerm(state) {
        state.searchTerm = null;
    },

    resetPageIndex(state) {
        state.pageIndex = 1;
    },

    updateSearchTerm(state, value) {
        state.searchTerm = value;
    },

    updatePageIndex(state, value) {
        state.pageIndex = value;
    },

    updatePageSize(state, value) {
        state.pageSize = value;
    },

    updateSorting(state, {sortedBy, ascSort}) {
        state.sortedBy = sortedBy;
        state.ascSort = ascSort;
    },

    resetSorting(state) {
        state.sortedBy = null;
        state.ascSort = false;
        eventBus.$emit('members-sorting-reset');
    },

    addDepartment(state, depatment) {
        Vue.set(state.allDepartments, depatment.id, depatment);
    },

    activateDepartment(state, departmentId) {
        state.currentDepartmentId = departmentId;
    },

    renameDepartmentById(state, {departmentId, name}) {
        state.allDepartments[departmentId].name = name;
    },

    addDepartmentManager(state, {departmentId, memberId}) {
        state.allDepartments[departmentId].managers.push(memberId);
    },

    removeDepartmentManager(state, {departmentId, memberId}) {
        let managers = state.allDepartments[departmentId].managers;
        managers.splice(managers.findIndex(id => id === memberId), 1);
    },

    removeDepartment(state, department) {
        removeDepartmentRecursively(department, state.members, state.allDepartments);
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}