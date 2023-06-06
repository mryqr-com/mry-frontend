import httpClient from '@/common/api/common-axios'

const createGroup = (command) => httpClient.post(`/groups`, command);
const renameGroup = (id, command) => httpClient.put(`/groups/${id}/name`, command);
const deleteGroup = (id) => httpClient.delete(`/groups/${id}`);
const listGroupMembers = (id) => httpClient.get(`/groups/${id}/members`, {showLoading: false});
const addGroupMembers = (id, command) => httpClient.put(`/groups/${id}/members`, command);
const addGroupManagers = (id, command) => httpClient.put(`/groups/${id}/managers`, command);
const removeGroupMember = (id, memberId) => httpClient.delete(`/groups/${id}/members/${memberId}`);
const addGroupManager = (id, memberId) => httpClient.put(`/groups/${id}/managers/${memberId}`);
const removeGroupManager = (id, memberId) => httpClient.delete(`/groups/${id}/managers/${memberId}`);
const archiveGroup = (id) => httpClient.put(`/groups/${id}/archive`);
const unArchiveGroup = (id) => httpClient.delete(`/groups/${id}/archive`);
const activateGroup = (id) => httpClient.put(`/groups/${id}/activation`);
const deactivateGroup = (id) => httpClient.put(`/groups/${id}/deactivation`);
const listGroupQrs = (groupId, queryCommand) => httpClient.post(`/groups/${groupId}/qrs`, queryCommand, {showLoading: false});

export default {
    createGroup,
    renameGroup,
    addGroupMembers,
    addGroupManagers,
    removeGroupMember,
    addGroupManager,
    removeGroupManager,
    deleteGroup,
    archiveGroup,
    unArchiveGroup,
    activateGroup,
    deactivateGroup,

    listGroupMembers,
    listGroupQrs,
}