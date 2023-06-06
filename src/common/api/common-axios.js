/* eslint-disable */
import axios from 'axios';
import {Loading} from 'element-ui';

let loading = null;

function isIpAddress(address) {
    return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(address);
}

function isCurrentUsingDomainName() {
    const hostname = location.hostname;
    return !isIpAddress(hostname) && hostname !== 'localhost';
}

//比如当前为http://console.mryqr.com, 返回http://api.mryqr.com
function apiBaseUrl() {
    if (!isCurrentUsingDomainName()) {
        return location.origin;
    }
    return location.origin.replace(/(:\/\/\w+\.)/, "://api.")
}

const axiosInstance = axios.create({
    baseURL: apiBaseUrl(),
    timeout: 30000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    }
});

function shouldHideLoading(config) {
    return config.hasOwnProperty('showLoading') && config.showLoading === false;
}

axiosInstance.interceptors.request.use(config => {
    if (!shouldHideLoading(config)) {
        loading = Loading.service({
            lock: true,
            background: 'rgba(255,255,255,0)',
        });
    }

    return config
});

axiosInstance.interceptors.response.use(response => {
    if (loading) {
        loading.close();
    }
    return response;
}, error => {
    if (loading) {
        loading.close();
    }
    return Promise.reject(error);
});

export default axiosInstance;

