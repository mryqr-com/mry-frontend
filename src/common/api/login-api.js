import httpClient from '@/common/api/common-axios'

const loginWithMobileOrEmail = (command) => httpClient.post(`/login`, command);
const loginWithVerificationCode = (command) => httpClient.post(`/verification-code-login`, command);
const logout = () => httpClient.delete(`/logout`);
const refreshToken = () => httpClient.put(`/refresh-token`);

export default {
    loginWithMobileOrEmail,
    loginWithVerificationCode,
    logout,
    refreshToken
}