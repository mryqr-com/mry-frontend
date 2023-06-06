import httpClient from '@/common/api/common-axios';

const newSubmission = (command) => httpClient.post(`/submissions`, command);
const updateSubmission = (submissionId, command) => httpClient.put(`/submissions/${submissionId}`, command);
const approveSubmission = (submissionId, command) => httpClient.post(`/submissions/${submissionId}/approval`, command);
const deleteSubmission = (id) => httpClient.delete(`/submissions/${id}`);

const fetchDetailedSubmission = (submissionId) => httpClient.get(`/submissions/${submissionId}`);
const fetchListSubmission = (submissionId, config = {showLoading: false}) => httpClient.get(`/submissions/lists/${submissionId}`, config);
const tryFetchInstanceLastSubmission = (qrId, pageId) => httpClient.get(`/submissions/${qrId}/${pageId}/instance-last-submission`);
const tryFetchMyLastSubmission = (qrId, pageId) => httpClient.get(`/submissions/${qrId}/${pageId}/my-last-submission`);
const tryFetchSubmissionAnswersForAutoFill = (qrId, pageId) => httpClient.get(`/submissions/${qrId}/${pageId}/auto-fill-answers`);
const listSubmissions = (query, config = {showLoading: true}) => httpClient.post(`/submissions/lists`, query, config);
const exportSubmissionsToExcel = (query, config = {
    showLoading: true,
    timeout: 60000,
    responseType: 'blob'
}) => httpClient.post(`/submissions/excel`, query, config);

const autoCalculateNumberInput = (query) => httpClient.post(`/submissions/auto-calculate/number-input`, query, {showLoading: false});
const autoCalculateItemStatus = (query) => httpClient.post(`/submissions/auto-calculate/item-status`, query, {showLoading: false});


export default {
    newSubmission,
    updateSubmission,
    deleteSubmission,
    approveSubmission,

    listSubmissions,
    fetchListSubmission,
    fetchDetailedSubmission,
    tryFetchInstanceLastSubmission,
    tryFetchMyLastSubmission,
    tryFetchSubmissionAnswersForAutoFill,
    exportSubmissionsToExcel,
    autoCalculateNumberInput,
    autoCalculateItemStatus,
}