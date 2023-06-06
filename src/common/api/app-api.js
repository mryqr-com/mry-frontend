import httpClient from '@/common/api/common-axios'

const createApp = (command) => httpClient.post(`/apps`, command);
const listMyManagedApps = (command) => httpClient.post(`/apps/my-managed-apps`, command);
const fetchOperationApp = (id, config = {showLoading: true}) => httpClient.get(`/apps/operation/${id}`, config);
const fetchUpdatableApp = (id) => httpClient.get(`/apps/updatable/${id}`);
const listMyViewableApps = () => httpClient.get(`/apps/my-viewable-apps`);
const listAppManagers = (id) => httpClient.get(`/apps/${id}/managers`);
const fetchAppFirstQr = (id) => httpClient.get(`/apps/${id}/first-qr`, {showLoading: false});
const fetchAppResourceUsages = (id) => httpClient.get(`/apps/${id}/resource-usages`, {showLoading: false});
const updateAppSetting = (id, command) => httpClient.put(`/apps/${id}/setting`, command);
const copyApp = (command) => httpClient.post(`/apps/copies`, command);
const setAppManagers = (id, command) => httpClient.put(`/apps/${id}/managers`, command);
const renameApp = (id, name) => httpClient.put(`/apps/${id}/name`, name);
const deleteApp = (id) => httpClient.delete(`/apps/${id}`);
const activateApp = (id) => httpClient.put(`/apps/${id}/activation`);
const deactivateApp = (id) => httpClient.put(`/apps/${id}/deactivation`);
const lockApp = (id) => httpClient.put(`/apps/${id}/lock`);
const unlockApp = (id) => httpClient.put(`/apps/${id}/unlock`);
const enableGroupSync = (id) => httpClient.put(`/apps/${id}/group-sync`);
const updateAppReportSetting = (id, command) => httpClient.put(`/apps/${id}/report-setting`, command);
const createAppFromTemplate = (appTemplateId) => httpClient.post(`/apps/templates/${appTemplateId}/adoptions`, {showLoading: false});
const fetchImportQrTemplate = (appId, config = {
    showLoading: false,
    timeout: 60000,
    responseType: 'blob'
}) => httpClient.get(`/apps/${appId}/qr-import-template`, config);

const updateAppWebhookSetting = (id, command) => httpClient.put(`/apps/${id}/webhook-setting`, command);
const fetchAppWebhookSetting = (id) => httpClient.get(`/apps/${id}/webhook-setting`, {showLoading: false});

export default {
    createApp,
    copyApp,
    createAppFromTemplate,
    renameApp,
    activateApp,
    deactivateApp,
    lockApp,
    unlockApp,
    setAppManagers,
    updateAppSetting,
    updateAppReportSetting,
    updateAppWebhookSetting,
    deleteApp,
    enableGroupSync,

    fetchAppFirstQr,
    listMyManagedApps,
    listMyViewableApps,
    fetchOperationApp,
    fetchUpdatableApp,
    listAppManagers,
    fetchAppResourceUsages,
    fetchImportQrTemplate,
    fetchAppWebhookSetting,
}