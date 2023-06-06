import httpClient from '@/common/api/common-axios'

const updateAppManual = (appId, command) => httpClient.put(`/app-manuals/${appId}`, command);
const fetchAppManual = (appId) => httpClient.get(`/app-manuals/${appId}`);

export default {
    updateAppManual,
    fetchAppManual,
}