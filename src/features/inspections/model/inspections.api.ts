import { apiClient } from '@/shared/api/api-client'
import type {
  InspectionDetail,
  InspectionExecution,
  InspectionObjectsByType,
  InspectionRiskAnalysis,
} from '@/entities/inspection/model/inspection.types'
import type { ApiResponse, ResponseData } from '@/shared/types/api'
import type { RequestParams } from '@/shared/api/create-api-client'

/** A file the inspector attaches, or the reason a file is turned back */
type ParamValue = { paramValue?: string }

export const inspectionsApi = {
  getObjectList: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<InspectionObjectsByType>>(`/inspections/${id}/objects`)
    return data.data
  },
  getObjectListByPagination: async (params: RequestParams, id: string) => {
    const { data } = await apiClient.get<ApiResponse<ResponseData<InspectionRiskAnalysis>>>(
      `/risk-analyses/by-inspection/${id}`,
      params
    )
    return data.data
  },
  getInspectionDetail: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<InspectionDetail>>(`/inspections/${id}`)
    return data.data
  },
  setFiles: async ({ data, id }: { data: object; id: string }) => {
    const { data: res } = await apiClient.post<ApiResponse<unknown>>(`/inspection-results/${id}/ombudsman`, data)
    return res.data
  },
  rejectInspectionReport: async ({ data, id }: { data: ParamValue; id: string }) => {
    const { data: res } = await apiClient.post<ApiResponse<unknown>>(`/inspection-executions/${id}/reject`, {
      rejectedReason: data?.paramValue || '',
    })
    return res.data
  },
  acceptInspectionReport: async (id: string) => {
    const { data: res } = await apiClient.post<ApiResponse<unknown>>(`/inspection-executions/${id}/accept`)
    return res.data
  },
  addFileToInspectionReport: async ({ data, id }: { data: ParamValue; id: string }) => {
    const { data: res } = await apiClient.post<ApiResponse<unknown>>(`/inspection-executions`, {
      inspectionChecklistId: id,
      filePath: data?.paramValue || '',
    })
    return res.data
  },
  getExecutionList: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<InspectionExecution[]>>(`/inspection-executions`, {
      checklistId: id,
    })
    return data.data
  },
  notify: async ({ id, startDate, endDate }: { id: string; startDate: string; endDate: string }) => {
    const { data: res } = await apiClient.post<ApiResponse<unknown>>(`/inspections/${id}/notify`, {
      startDate,
      endDate,
    })
    return res.data
  },
}
