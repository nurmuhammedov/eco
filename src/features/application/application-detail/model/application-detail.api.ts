import type { ApplicationDocument, ExecutionLog } from './document-types'
import { apiClient } from '@/shared/api/api-client'
import { type ApiResponse } from '@/shared/types/api'
import { type OptionItem } from '@/shared/types/general'

/**
 * Request bodies here are assembled by the form that sends them, so their shape
 * belongs to the call site rather than to this module.
 */
type RequestBody = Record<string, unknown>

export const applicationDetailApi = {
  getApplicantDocs: async (id: string) => {
    const { data } = await apiClient.getWithPagination<ApplicationDocument>(`/appeals/${id}/request-docs`)
    return data
  },
  getResponseDocs: async (id: string) => {
    const { data } = await apiClient.getWithPagination<ApplicationDocument>(`/appeals/${id}/reply-docs`)
    return data
  },
  getApplicationDetail: async (id?: string) => {
    const { data } = await apiClient.get<any>(`/appeals/${id}`)
    return data.data
  },
  getApplicationLogs: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<ExecutionLog[]>>(`/execution-processes/appeal/${id}`)
    return data.data
  },
  getChangeLogs: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<ExecutionLog[]>>(`/execution-processes/change/${id}`)
    return data.data
  },
  getInspectorListSelect: async (isSupervisor?: boolean, officeId?: string | number) => {
    let url = isSupervisor ? `/users/regulator-users/controllers/select` : `/users/office-users/inspectors/select`
    if (officeId) {
      url += `?officeId=${officeId}`
    }
    const { data } = await apiClient.get<ApiResponse<OptionItem<string>[]>>(url)
    return data.data
  },
  getManagerListSelect: async () => {
    const { data } = await apiClient.get<ApiResponse<OptionItem<string>[]>>(`/users/committee-users/managers/select`)
    return data.data
  },
  attachInspector: async (data: RequestBody) => {
    const { data: res } = await apiClient.post<any>(`/appeals/set-inspector`, data)
    return res.data
  },
  rejectDocument: async (data: RequestBody) => {
    const { data: res } = await apiClient.post<any>(`/appeals/rejection`, data)
    return res.data
  },
  confirmDocument: async (data: { appealId?: string; documentId?: string; shouldRegister?: boolean }) => {
    const { data: res } = await apiClient.post<any>(`/appeals/confirmation`, data)
    return res.data
  },
  uploadFile: async (payload: RequestBody, url = '/appeals/upload-file') => {
    const { data: res } = await apiClient.post<any>(url, payload)
    return res.data
  },
  updateFile: async (id: string, payload: RequestBody, url = 'hf') => {
    const { data: res } = await apiClient.patch<any>(`/${url}/${id}`, payload)
    return res.data
  },
}
