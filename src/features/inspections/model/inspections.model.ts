import { apiClient } from '@/shared/api';

export const inspectionsApi = {
  getObjectList: async (params: any, type: any) => {
    const { data } = await apiClient.get<any>(`/risk-assessments/${type}`, params);
    return data.data;
  },
  getInspectionDetail: async (id: any) => {
    const { data } = await apiClient.get<any>(`/inspections/${id}`);
    return data.data;
  },
  attachInspectors: async ({ data, id }: { data: any; id: any }) => {
    const { data: res } = await apiClient.put<any>(`/inspections/set-inspector/${id}`, data);
    return res.data;
  },
  setFiles: async ({ data, id }: { data: any; id: any }) => {
    const { data: res } = await apiClient.put<any>(`/inspections/set-files/${id}`, data);
    return res.data;
  },
  addInspectionReport: async ({ data, id }: { data: any; id: any }) => {
    const { data: res } = await apiClient.post<any>(`/inspection-reports/${id}`, data);
    return res.data;
  },
  editInspectionReport: async ({ data, id }: { data: any; id: any }) => {
    const { data: res } = await apiClient.patch<any>(`/inspection-reports/${id}`, data);
    return res.data;
  },
  getInspectionList: async (params: any) => {
    const { data } = await apiClient.get<any>(`/inspection-reports`, params);
    return data.data;
  },
  rejectInspectionReport: async ({ data, id }: { data: any; id: any }) => {
    const { data: res } = await apiClient.put<any>(`/inspection-report-executions/${id}`, data);
    return res.data;
  },
  acceptInspectionReport: async (id: any) => {
    const { data: res } = await apiClient.patch<any>(`/inspection-report-executions/${id}`, {});
    return res.data;
  },
  addFileToInspectionReport: async ({ data, id }: { data: any; id: any }) => {
    const { data: res } = await apiClient.post<any>(`/inspection-report-executions/${id}`, data);
    return res.data;
  },
  getExecutionList: async (id: any) => {
    const { data } = await apiClient.get<any>(`/inspection-report-executions/${id}`);
    return data.data;
  },
  getActDetail: async (id: any) => {
    const { data } = await apiClient.get<any>(`/inspections/act/${id}`);
    return data.data;
  },
};
