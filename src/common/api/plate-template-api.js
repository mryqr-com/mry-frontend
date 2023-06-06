import httpClient from "@/common/api/common-axios";

const createPlateTemplate = (command) => httpClient.post(`/plate-templates`, command);
const listPlateTemplates = () => httpClient.get(`/plate-templates`, {showLoading: false});
const deletePlateTemplate = (id) => httpClient.delete(`/plate-templates/${id}`);
const updatePlateTemplate = (id, command) => httpClient.put(`/plate-templates/${id}`, command);

export default {
    createPlateTemplate,
    deletePlateTemplate,
    listPlateTemplates,
    updatePlateTemplate,
}