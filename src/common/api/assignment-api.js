import httpClient from '@/common/api/common-axios';

const deleteAssignment = (id) => httpClient.delete(`/assignments/${id}`);
const setOperators = (id, command) => httpClient.put(`/assignments/${id}/operators`, command);
const fetchAssignmentDetail = (id) => httpClient.get(`/assignments/${id}/detail`, {showLoading: false});
const fetchAssignmentQrDetail = (assignmentId, qrId) => httpClient.get(`/assignments/${assignmentId}/qrs/${qrId}/detail`, {showLoading: false});
const listManagedAssignments = (query, config = {showLoading: true}) => httpClient.post(`/assignments/my-managed-assignments`, query, config);
const listMyAssignments = (query, config = {showLoading: true}) => httpClient.post(`/assignments/my-assignments`, query, config);
const listAssignmentQrs = (id, query, config = {showLoading: true}) => httpClient.post(`/assignments/${id}/qrs`, query, config);

export default {
    deleteAssignment,
    setOperators,
    listManagedAssignments,
    listMyAssignments,
    listAssignmentQrs,
    fetchAssignmentDetail,
    fetchAssignmentQrDetail,
}