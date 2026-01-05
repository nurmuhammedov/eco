import { apiClient } from '@/shared/api/api-client'

export const inspectionsApi = {
  getObjectList: async (id: any) => {
    const { data } = await apiClient.get<any>(`/inspections/${id}/objects`)
    return data.data
  },
  getObjectListByPagination: async (params: any, id: any) => {
    const { data } = await apiClient.get<any>(`/risk-analyses/by-inspection/${id}`, params)
    return data.data
  },
  getInspectionDetail: async (id: any) => {
    const { data } = await apiClient.get<any>(`/inspections/${id}`)
    return data.data
  },
  setFiles: async ({ data, id }: { data: any; id: any }) => {
    const { data: res } = await apiClient.post<any>(`/inspection-results/${id}/ombudsman`, data)
    return res.data
  },
  rejectInspectionReport: async ({ data, id }: { data: any; id: any }) => {
    const { data: res } = await apiClient.post<any>(`/inspection-executions/${id}/reject`, {
      rejectedReason: data?.paramValue || '',
    })
    return res.data
  },
  acceptInspectionReport: async (id: any) => {
    const { data: res } = await apiClient.post<any>(`/inspection-executions/${id}/accept`)
    return res.data
  },
  addFileToInspectionReport: async ({ data, id }: { data: any; id: any }) => {
    const { data: res } = await apiClient.post<any>(`/inspection-executions`, {
      inspectionChecklistId: id,
      filePath: data?.paramValue || '',
    })
    return res.data
  },
  getExecutionList: async (id: any) => {
    const { data } = await apiClient.get<any>(`/inspection-executions`, { checklistId: id })
    return data.data
  },
}
