import httpClient from "@/common/api/common-axios";

const requestQuote = (queryCommand) => httpClient.post(`/orders/quotations`, queryCommand, {showLoading: false});
const requestInvoice = (orderId, command) => httpClient.post(`/orders/${orderId}/invoice-request`, command);
const createOnlineOrder = (command) => httpClient.post(`/orders`, command);
const fetchOrderStatus = (orderId) => httpClient.get(`/orders/${orderId}/status`, {showLoading: false});
const fetchDetailedOrder = (orderId) => httpClient.get(`/orders/${orderId}`);
const fetchOrderShipment = (orderId) => httpClient.get(`/orders/${orderId}/shipment`);
const listOrders = (queryCommand) => httpClient.post(`/orders/list`, queryCommand);

export default {
    requestQuote,
    createOnlineOrder,
    fetchOrderStatus,
    listOrders,
    fetchDetailedOrder,
    requestInvoice,
    fetchOrderShipment,
}