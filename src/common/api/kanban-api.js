import httpClient from '@/common/api/common-axios'

const fetchKanban = (command) => httpClient.post(`/kanban`, command, {showLoading: false});

export default {
    fetchKanban
}