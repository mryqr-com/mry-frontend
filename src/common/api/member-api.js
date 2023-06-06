import httpClient from '@/common/api/common-axios';

let memberDirty = false;
let allMembers = [];
let _memberColumnFilters = [];

const memberColumnFilters = function () {
    if (memberDirty || _memberColumnFilters.length === 0) {
        return listMemberReferences().then((members) => {
            _memberColumnFilters = members.map(member => {
                return {text: member.showName, value: member.id};
            });
            return _memberColumnFilters;
        })
    } else {
        return Promise.resolve(_memberColumnFilters);
    }
}

let listMemberReferencesPromise = null;

function fetchMemberReferences() {
    if (listMemberReferencesPromise && !memberDirty) {
        return listMemberReferencesPromise;
    }

    listMemberReferencesPromise = httpClient.get('/members/all-references', {showLoading: false});
    return listMemberReferencesPromise;
}

const listMemberReferences = function () {
    if (memberDirty || allMembers.length === 0) {
        return fetchMemberReferences().then((response) => {
            allMembers = response.data;
            memberDirty = false;
            return allMembers;
        });
    } else {
        return Promise.resolve(allMembers);
    }
};

const fetchMyProfile = () => httpClient.get('/members/me', {showLoading: false});
const fetchMyClientProfile = () => httpClient.get('/members/client/me', {showLoading: false});
const fetchMyMemberInfo = () => httpClient.get('/members/me/info');

let listMemberReferencesForTenantPromise = null;
let tenantMembersMap = new Map();

function fetchMemberReferencesForTenant(tenantId) {
    if (listMemberReferencesForTenantPromise) {
        return listMemberReferencesForTenantPromise;
    }

    listMemberReferencesForTenantPromise = httpClient.get(`/members/all-references/${tenantId}`, {showLoading: false});
    return listMemberReferencesForTenantPromise;
}

const listMemberReferencesForTenant = (tenantId) => {
    let members = tenantMembersMap.get(tenantId);
    if (members) {
        return Promise.resolve(members);
    }

    return fetchMemberReferencesForTenant(tenantId).then(response => {
        tenantMembersMap.set(tenantId, response.data);
        return tenantMembersMap.get(tenantId);
    });
};

const createMember = function (command) {
    memberDirty = true;
    return httpClient.post(`/members`, command);
};

const importMembers = (formData) => httpClient.post(`/members/import`, formData, {
    headers: {'Content-Type': 'multipart/form-data'},
    showLoading: false,
    timeout: 300000,
});

const listMyManagedMembers = function (command) {
    return httpClient.post(`/members/my-managed-members`, command);
};

const topApp = function (appId) {
    return httpClient.put(`/members/me/top-apps/${appId}`);
};

const cancelTopApp = function (appId) {
    return httpClient.delete(`/members/me/top-apps/${appId}`);
};

const deleteMember = function (id) {
    memberDirty = true;
    return httpClient.delete(`/members/${id}`);
};

const deactivateMember = id => httpClient.put(`/members/${id}/deactivation`);
const activateMember = id => httpClient.put(`/members/${id}/activation`);

const unbindMemberWx = id => httpClient.delete(`/members/${id}/wx`);
const unbindMyWx = () => httpClient.delete(`/members/me/wx`);

const updateMember = function (memberId, command) {
    memberDirty = true;
    return httpClient.put(`/members/${memberId}`, command);
};

const updateMemberRole = function (memberId, command) {
    memberDirty = true;
    return httpClient.put(`/members/${memberId}/role`, command);
};

const resetPasswordForMember = function (memberId, command) {
    return httpClient.put(`/members/${memberId}/password`, command);
};

const updateMyBaseSetting = function (command) {
    return httpClient.put(`/members/me/base-setting`, command);
};

const updateMyAvatar = function (command) {
    return httpClient.put(`/members/me/avatar`, command, {showLoading: false});
};

const deleteMyAvatar = function () {
    return httpClient.delete(`/members/me/avatar`, {showLoading: false});
};

const fetchMyBaseSetting = () => httpClient.get(`members/me/base-setting`);

const changeMyPassword = function (command) {
    return httpClient.put(`/members/me/password`, command);
};

const changeMyMobile = function (command) {
    return httpClient.put(`/members/me/mobile`, command);
};

const identifyMyMobile = function (command) {
    return httpClient.put(`/members/me/mobile-identification`, command);
};

const findBackPassword = function (command) {
    return httpClient.post(`/members/findback-password`, command);
};

export default {
    createMember,
    importMembers,
    updateMember,
    updateMemberRole,
    deleteMember,
    activateMember,
    deactivateMember,
    resetPasswordForMember,
    unbindMemberWx,
    changeMyPassword,
    changeMyMobile,
    identifyMyMobile,
    updateMyBaseSetting,
    updateMyAvatar,
    deleteMyAvatar,
    unbindMyWx,
    findBackPassword,
    topApp,
    cancelTopApp,

    fetchMyProfile,
    fetchMyClientProfile,
    fetchMyMemberInfo,
    fetchMyBaseSetting,
    listMyManagedMembers,
    listMemberReferences,
    listMemberReferencesForTenant,

    memberColumnFilters,
}