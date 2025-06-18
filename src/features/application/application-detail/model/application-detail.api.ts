import { apiClient } from '@/shared/api';

export const applicationDetailApi = {
  getApplicantDocs: async (id: any) => {
    const { data } = await apiClient.getWithPagination(`/appeals/${id}/request-docs`);
    return data;
  },
  getResponseDocs: async (id: any) => {
    const { data } = await apiClient.getWithPagination(`/appeals/${id}/reply-docs`);
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
    const { data: res } = await apiClient.post<any>(`/appeals/set-inspector`, data);
    return res.data;
  },
  //
  // confirmDocument: async (data: any) => {
  //   const { data: res } = await apiClient.post<any>(`/appeals/confirmation`, data);
  //   return res.data;
  // },

  rejectDocument: async (data: any) => {
    const { data: res } = await apiClient.post<any>(`/appeals/rejection`, data);
    return res.data;
  },

  confirmDocument: async (data: { appealId: any; documentId: any; shouldRegister?: boolean }) => {
    const { data: res } = await apiClient.post<any>(`/appeals/confirmation`, data);
    return res.data;
  },
};
