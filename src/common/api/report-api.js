import httpClient from '@/common/api/common-axios';

const fetchNumberReport = (query) => httpClient.post(`/reports/number`, query, {showLoading: false});
const fetchChartReport = (query) => httpClient.post(`/reports/chart`, query, {showLoading: false});

export default {
    fetchNumberReport,
    fetchChartReport,
}