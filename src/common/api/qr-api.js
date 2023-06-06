import httpClient from '@/common/api/common-axios';

const createQr = (command) => httpClient.post(`/qrs`, command);
const createQrFromPlate = (command) => httpClient.post(`/qrs/from-plate`, command);
const importQrs = (formData) => httpClient.post(`/qrs/import`, formData, {
    headers: {'Content-Type': 'multipart/form-data'},
    showLoading: false,
    timeout: 300000,
});

const renameQr = (qrId, command) => httpClient.put(`/qrs/${qrId}/name`, command);
const resetQrPlate = (qrId, command) => httpClient.put(`/qrs/${qrId}/plate`, command);
const resetQrCirculationStatus = (qrId, command) => httpClient.put(`/qrs/${qrId}/circulation-status`, command);
const deleteQrs = (command) => httpClient.post(`/qrs/deletion`, command);
const deleteQr = (qrId) => httpClient.delete(`/qrs/${qrId}`);
const changeQrsGroup = (command) => httpClient.put(`/qrs/group`, command);
const listMyViewableQrs = (query, config = {showLoading: true}) => httpClient.post(`/qrs/my-viewable-qrs`, query, config);
const fetchMyViewableListQr = (qrId) => httpClient.get(`/qrs/my-viewable-qrs/${qrId}`, {showLoading: false});
const fetchSubmissionQr = (plateId) => httpClient.get(`/qrs/submission-qrs/${plateId}`);
const updateQrBaseSetting = (qrId, command) => httpClient.put(`/qrs/${qrId}/base-setting`, command);
const fetchQrBaseSetting = (qrId) => httpClient.get(`/qrs/${qrId}/base-setting`);
const fetchQrSummary = (qrId) => httpClient.get(`/qrs/${qrId}/summary`);
const markQrAsTemplate = (qrId) => httpClient.put(`/qrs/${qrId}/template`);
const unmarkQrAsTemplate = (qrId) => httpClient.delete(`/qrs/${qrId}/template`);
const listQrSubmissions = (qrId, command) => httpClient.post(`/qrs/${qrId}/submissions`, command, {showLoading: false});
const fetchQrPlateAttributeValues = (command) => httpClient.post(`/qrs/plate-attribute-values`, command);
const fetchBindQrPlateInfo = (plateId) => httpClient.get(`/qrs/bind-plate-infos/${plateId}`);
const exportQrsToExcel = (query, config = {
    showLoading: true,
    timeout: 60000,
    responseType: 'blob'
}) => httpClient.post(`/qrs/export`, query, config);

const activateQr = (qrId) => httpClient.put(`/qrs/${qrId}/activation`);
const deactivateQr = (qrId) => httpClient.put(`/qrs/${qrId}/deactivation`);

export default {
    createQr,
    createQrFromPlate,
    importQrs,
    renameQr,
    resetQrPlate,
    resetQrCirculationStatus,
    deleteQrs,
    deleteQr,
    changeQrsGroup,
    markQrAsTemplate,
    unmarkQrAsTemplate,
    activateQr,
    deactivateQr,
    updateQrBaseSetting,

    listMyViewableQrs,
    fetchMyViewableListQr,
    exportQrsToExcel,
    fetchSubmissionQr,
    fetchQrBaseSetting,
    fetchQrSummary,
    listQrSubmissions,
    fetchBindQrPlateInfo,
    fetchQrPlateAttributeValues,
}