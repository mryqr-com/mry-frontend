import httpClient from '@/common/api/common-axios';

const requestOssToken = (command) => httpClient.post('/aliyun/oss-token-requisitions', command, {showLoading: false});

export default {
    requestOssToken,
}