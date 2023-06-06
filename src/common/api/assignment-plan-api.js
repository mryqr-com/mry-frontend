import httpClient from '@/common/api/common-axios';

const createAssignmentPlan = (command) => httpClient.post(`/assignment-plans`, command);
const updateAssignmentPlanSetting = (id, command) => httpClient.put(`/assignment-plans/${id}/setting`, command);
const listAssignmentPlans = (appId, groupId = null) => httpClient.get(`/assignment-plans/apps/${appId}`, {params: {groupId: groupId}});
const deleteAssignmentPlan = (id) => httpClient.delete(`/assignment-plans/${id}`);
const excludeGroups = (id, command) => httpClient.put(`/assignment-plans/${id}/excluded-groups`, command);
const setGroupOperators = (id, command) => httpClient.put(`/assignment-plans/${id}/group-operators`, command);
const activateAssignmentPlan = (id) => httpClient.put(`/assignment-plans/${id}/activation`);
const deactivateAssignmentPlan = (id) => httpClient.put(`/assignment-plans/${id}/deactivation`);
const listAssignmentPlanSummaries = (appId) => httpClient.get(`/assignment-plans/apps/${appId}/summaries`, {showLoading: false});
const listAssignmentPlanSummariesForGroup = (groupId) => httpClient.get(`/assignment-plans/groups/${groupId}/summaries`, {showLoading: false});

export default {
    createAssignmentPlan,
    listAssignmentPlans,
    updateAssignmentPlanSetting,
    deleteAssignmentPlan,
    excludeGroups,
    setGroupOperators,
    activateAssignmentPlan,
    deactivateAssignmentPlan,
    listAssignmentPlanSummaries,
    listAssignmentPlanSummariesForGroup,
}