import httpClient from "@/common/api/common-axios";

const createDepartment = (command) => httpClient.post(`/departments`, command);
const deleteDepartment = (id) => httpClient.delete(`/departments/${id}`);
const renameDepartment = (id, command) => httpClient.put(`/departments/${id}/name`, command);
const addDepartmentManager = (departmentId, memberId) => httpClient.put(`/departments/${departmentId}/managers/${memberId}`);
const removeDepartmentManager = (departmentId, memberId) => httpClient.delete(`/departments/${departmentId}/managers/${memberId}`);

export default {
    createDepartment,
    deleteDepartment,
    renameDepartment,
    addDepartmentManager,
    removeDepartmentManager,
}