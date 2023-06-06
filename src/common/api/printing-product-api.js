import httpClient from '@/common/api/common-axios'

const listPrintingProducts = () => httpClient.get(`/printing-products`);

export default {
    listPrintingProducts,
}