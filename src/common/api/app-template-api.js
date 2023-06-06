import httpClient from '@/common/api/common-axios'

const listPublishedAppTemplates = (command) => httpClient.post(`/apptemplates/published-lists`, command);
const fetchAppTemplateDetail = (id) => httpClient.get(`/apptemplates/${id}`);

export default {
    listPublishedAppTemplates,
    fetchAppTemplateDetail,
}