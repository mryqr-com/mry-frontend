import httpClient from '@/common/api/common-axios'

const createVerificationCodeForRegister = (command) => httpClient.post(`/verification-codes/for-register`,
    command,
    {showLoading: false});

const createVerificationCodeForLogin = (command) => httpClient.post(`/verification-codes/for-login`,
    command,
    {showLoading: false});

const createVerificationCodeForFindbackPassword = (command) => httpClient.post(`/verification-codes/for-findback-password`,
    command,
    {showLoading: false});

const createVerificationCodeForChangeMobile = (command) => httpClient.post(`/verification-codes/for-change-mobile`,
    command,
    {showLoading: false});

const createVerificationCodeForIdentifyMobile = (command) => httpClient.post(`/verification-codes/for-identify-mobile`,
    command,
    {showLoading: false});

export default {
    createVerificationCodeForRegister,
    createVerificationCodeForLogin,
    createVerificationCodeForFindbackPassword,
    createVerificationCodeForChangeMobile,
    createVerificationCodeForIdentifyMobile,
}