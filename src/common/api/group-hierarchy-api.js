import httpClient from '@/common/api/common-axios'

const updateGroupHierarchy = (appId, command) => httpClient.put(`/group-hierarchies/apps/${appId}`, command);
const fetchGroupHierarchy = (appId) => httpClient.get(`/group-hierarchies/apps/${appId}`, {showLoading: false});

export default {
    updateGroupHierarchy,
    fetchGroupHierarchy,
}