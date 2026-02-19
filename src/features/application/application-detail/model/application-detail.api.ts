import { apiClient } from '@/shared/api/api-client'

export const applicationDetailApi = {
  getApplicantDocs: async (id: any) => {
    const { data } = await apiClient.getWithPagination(`/appeals/${id}/request-docs`)
    return data
  },
  getResponseDocs: async (id: any) => {
    const { data } = await apiClient.getWithPagination(`/appeals/${id}/reply-docs`)
    return data
  },
  getLegalApplicantInfo: async (tin: any) => {
    const { data } = await apiClient.get<any>(`/users/legal/${tin}`)
    return data.data
  },
  getLegalIipInfo: async (tin: any) => {
    const payload = { tin: tin }
    const { data: res } = await apiClient.post<any>(`/integration/iip/legal`, payload)
    return res.data
  },
  getApplicationDetail: async (id: any) => {
    const { data } = await apiClient.get<any>(`/appeals/${id}`)
    return data.data
  },
  getApplicationLogs: async (id: any) => {
    const { data } = await apiClient.get<any>(`/execution-processes/appeal/${id}`)
    return data.data
  },
  getChangeLogs: async (id: any) => {
    const { data } = await apiClient.get<any>(`/execution-processes/change/${id}`)
    return data.data
  },
  getInspectorListSelect: async (isSupervisor?: boolean) => {
    const url = isSupervisor ? `/users/regulator-users/inspectors/select` : `/users/office-users/inspectors/select`
    const { data } = await apiClient.get<any>(url)
    return data.data
  },
  getManagerListSelect: async () => {
    const { data } = await apiClient.get<any>(`/users/committee-users/managers/select`)
    return data.data
  },
  attachInspector: async (data: any) => {
    const { data: res } = await apiClient.post<any>(`/appeals/set-inspector`, data)
    return res.data
  },
  rejectDocument: async (data: any) => {
    const { data: res } = await apiClient.post<any>(`/appeals/rejection`, data)
    return res.data
  },
  confirmDocument: async (data: { appealId: any; documentId: any; shouldRegister?: boolean }) => {
    const { data: res } = await apiClient.post<any>(`/appeals/confirmation`, data)
    return res.data
  },
  uploadFile: async (payload: any, url = '/appeals/upload-file') => {
    const { data: res } = await apiClient.post<any>(url, payload)
    return res.data
  },
  updateFile: async (id: string, payload: any, url = 'hf') => {
    const { data: res } = await apiClient.patch<any>(`/${url}/${id}`, payload)
    return res.data
  },
}
