import httpClient from '@/common/api/common-axios';

const createPlateBatch = (command) => httpClient.post(`/platebatches`, command);
const deletePlateBatch = (id) => httpClient.delete(`/platebatches/${id}`);
const renamePlateBatch = (id, command) => httpClient.put(`/platebatches/${id}/name`, command);
const listMyManagedPlateBatches = (queryCommand) => httpClient.post(`/platebatches/my-managed-platebatches`, queryCommand);
const allPlateIdsUnderPlateBatch = (id) => httpClient.get(`/platebatches/${id}/plate-ids`);
const unusedPlateIdsUnderPlateBatch = (id) => httpClient.get(`/platebatches/${id}/unused-plate-ids`);

export default {
    createPlateBatch,
    renamePlateBatch,
    deletePlateBatch,

    listMyManagedPlateBatches,
    allPlateIdsUnderPlateBatch,
    unusedPlateIdsUnderPlateBatch,
}