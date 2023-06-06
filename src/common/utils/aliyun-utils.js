import aliyunApi from '@/common/api/aliyun-api';

let tokenCache = new Map();

export function getOssToken(command) {
    let key = JSON.stringify(command);

    if (tokenCache.has(key) && tokenCache.get(key).expiration > Date.now()) {
        return Promise.resolve(tokenCache.get(key));
    }

    return aliyunApi.requestOssToken(command).then((response) => {
        let token = response.data;
        tokenCache.set(key, token);
        return token;
    });
}

export function createOssClient(ossToken) {
    return import(/* webpackChunkName: "ali-oss" */ 'ali-oss').then(({default: _}) => {
        return new _({
            endpoint: ossToken.endpoint,
            secure: ossToken.secure,
            accessKeyId: ossToken.accessKeyId,
            accessKeySecret: ossToken.accessKeySecret,
            stsToken: ossToken.securityToken,
            bucket: ossToken.bucket,
            refreshSTSTokenInterval: 60000 * 5,//去掉warning，当前没用，因为需要配合refreshSTSToken使用
            cname: true
        });
    });
}