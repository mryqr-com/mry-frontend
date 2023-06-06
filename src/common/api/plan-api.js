import httpClient from "@/common/api/common-axios";

const listPlans = () => httpClient.get(`/plans`);

export default {
    listPlans,
}