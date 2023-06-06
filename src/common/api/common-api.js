import httpClient from '@/common/api/common-axios'

let administrativePromise = null;

const fetchAdministratives = () => {
    if (administrativePromise) {
        return administrativePromise;
    }

    return import(/* webpackChunkName: "administrative" */ '@/common/assets/administrative.json').then(({default: json}) => {
        administrativePromise = Promise.resolve({data: json});
        return administrativePromise;
    });

};

const fetchMobileWxInfo = () => httpClient.get('/wx/mobile-info', {showLoading: false});
const fetchPcWxInfo = () => httpClient.get('/wx/pc-info', {showLoading: false});
const fetchWxJsSdkConfig = (url) => httpClient.post(`/wx/jssdk-config`, {url: url}, {showLoading: false});

export default {
    fetchAdministratives,
    fetchMobileWxInfo,
    fetchPcWxInfo,
    fetchWxJsSdkConfig,
}