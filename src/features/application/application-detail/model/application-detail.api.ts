import {apiClient} from '@/shared/api';

export const applicationDetailApi = {
    getApplicantDocs: async (id: any) => {
        const {data} = await apiClient.getWithPagination(`/appeals/${id}/request-docs`);
        return data;
    },

    getLegalApplicantInfo: async (tin: any) => {
        const {data} = await apiClient.get<any>(`/users/legal/${tin}`);
        return data.data;
    },
};
