import httpClient from '@/common/api/common-axios';

const fetchTenantBaseSetting = () => httpClient.get(`/tenants/current/base-setting`, {showLoading: false});
const updateTenantBaseSetting = (command) => httpClient.put(`/tenants/current/base-setting`, command);

const fetchTenantInfo = () => httpClient.get(`/tenants/current/info`, {showLoading: false});

const fetchTenantLogo = () => httpClient.get(`/tenants/current/logo`, {showLoading: false});
const updateTenantLogo = (command) => httpClient.put(`/tenants/current/logo`, command);

const fetchTenantSubdomain = () => httpClient.get(`/tenants/current/subdomain`, {showLoading: false});
const updateTenantSubdomain = (command) => httpClient.put(`/tenants/current/subdomain`, command);

const fetchTenantInvoiceTitle = () => httpClient.get(`/tenants/current/invoice-title`, {showLoading: false});
const updateTenantInvoiceTitle = (command) => httpClient.put(`/tenants/current/invoice-title`, command);

const fetchTenantApiSetting = () => httpClient.get(`/tenants/current/api-setting`, {showLoading: false});
const refreshTenantApiSecret = () => httpClient.put(`/tenants/current/api-secret`);

const fetchTenantPublicProfile = (subdomainPrefix) => httpClient.get(`/tenants/public-profile/${subdomainPrefix}`);

const listConsignees = () => httpClient.get(`/tenants/current/consignees`);
const addConsignee = (command) => httpClient.post(`/tenants/current/consignees`, command);
const updateConsignee = (command) => httpClient.put(`/tenants/current/consignees`, command);
const deleteConsignee = (consigneeId) => httpClient.delete(`/tenants/current/consignees/${consigneeId}`);

export default {
    updateTenantBaseSetting,
    updateTenantLogo,
    fetchTenantSubdomain,
    refreshTenantApiSecret,
    updateTenantInvoiceTitle,

    fetchTenantInfo,
    fetchTenantBaseSetting,
    fetchTenantLogo,
    updateTenantSubdomain,
    fetchTenantApiSetting,
    fetchTenantPublicProfile,
    fetchTenantInvoiceTitle,
    listConsignees,
    addConsignee,
    updateConsignee,
    deleteConsignee,
}