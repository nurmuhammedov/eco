import { apiClient } from '@/shared/api';

export const applicationDetailApi = {
  getApplicantDocs: async (id: any) => {
    const { data } = await apiClient.getWithPagination(`/appeals/${id}/request-docs`);
    return data;
  },

  getLegalApplicantInfo: async (tin: any) => {
    const { data } = await apiClient.get<any>(`/users/legal/${tin}`);
    return data.data;
  },

  getApplicationDetail: async (id: any) => {
    const { data } = await apiClient.get<any>(`/appeals/${id}`);
    return data.data;
  },

  getInspectorListSelect: async () => {
    const { data } = await apiClient.get<any>(`/users/office-users/inspectors/select`);
    return data.data;
  },

  attachInspector: async (data: any) => {
    const { data: res } = await apiClient.patch<any>(`/appeals/set-inspector`, data);
    return res.data;
  },
};
