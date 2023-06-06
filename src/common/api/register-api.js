import httpClient from '@/common/api/common-axios'

const register = (command) => httpClient.post(`/registration`, command);

export default {
    register
}