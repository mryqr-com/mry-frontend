import httpClient from "@/common/api/common-axios";

const fetchDepartmentHierarchy = () => httpClient.get('/department-hierarchy', {showLoading: false});
const updateDepartmentHierarchy = (command) => httpClient.put('/department-hierarchy', command);

export default {
    fetchDepartmentHierarchy,
    updateDepartmentHierarchy,
}