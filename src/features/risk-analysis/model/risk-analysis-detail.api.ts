import { apiClient } from '@/shared/api/api-client'

export const riskAnalysisDetailApi = {
  rejectRiskItem: async ({ type, data }: { type: any; data: any }) => {
    const { data: res } = await apiClient.post<any>(`/${type?.toLowerCase()}-risk-indicators`, data)
    return res.data
  },
  getRiskItems: async (params: any, type: any) => {
    const { data } = await apiClient.get<any>(`/${type?.toLowerCase()}-risk-indicators/for-one`, params)
    return data.data
  },
  attachFile: async ({ type, data, id }: { type: any; data: any; id: any }) => {
    const { data: res } = await apiClient.patch<any>(`/${type?.toLowerCase()}-risk-indicators/${id}`, data)
    return res.data
  },
  cancelPoints: async ({ type, data, id }: { type: any; data: any; id: any }) => {
    const { data: res } = await apiClient.patch<any>(`/${type?.toLowerCase()}-risk-indicators/cancel/${id}`, data)
    return res.data
  },
  getObjectInfo: async ({ type, id }: { type: any; id: any }) => {
    const { data } = await apiClient.get<any>(`/${type}/${id}`)
    return data.data
  },
  getInspectorInfo: async ({ type, id }: { type: any; id: any }) => {
    const { data } = await apiClient.get<any>(`/assign-inspector-${type}/${id}`)
    return data.data
  },
  getFilesToFix: async ({ type, params }: { type: any; params: any }) => {
    const { data } = await apiClient.get<any>(`/${type?.toLowerCase()}-risk-indicators/to-fix`, params)
    return data.data
  },
  addCheckList: async (data: any) => {
    const { data: res } = await apiClient.post<any>(`/checklists`, data)
    return res.data
  },
  getChecklist: async (params: any) => {
    const { data } = await apiClient.get<any>(`/checklists`, params)
    return data.data
  },
  deleteChecklist: async (id: any) => {
    const { data: res } = await apiClient.delete<any>(`/checklists/${id}`)
    return res.data
  },
}
