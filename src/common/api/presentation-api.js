import httpClient from '@/common/api/common-axios'

const fetchPresentation = (qrId, pageId, controlId) => httpClient.get(`/presentations/${qrId}/${pageId}/${controlId}`, {showLoading: false});

export default {
    fetchPresentation,
}