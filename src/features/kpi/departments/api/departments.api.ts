import { servicesApiClient } from '@/shared/api/services-api-client'
import { ApiResponse } from '@/shared/types/api'

export interface Department {
  id: string
  name: string
  is_active: boolean
  responsible_id?: string | null
  responsible_username?: string | null
  responsible_name?: string | null
  created_at: string
  updated_at: string
}

export interface ResponsibleUser {
  id: string
  name: string
  username: string // PINFL
}

export interface CreateDepartmentDTO {
  name: string
  responsible_id?: string | null
  responsible_username?: string | null
  responsible_name?: string | null
}

export interface UpdateDepartmentDTO {
  name: string
  is_active: boolean
  responsible_id?: string | null
  responsible_username?: string | null
  responsible_name?: string | null
}

const BASE_URL = '/kpi/departments'

export const departmentsAPI = {
  getAll: (): Promise<ApiResponse<Department[]>> => {
    return servicesApiClient.get<Department[]>(BASE_URL)
  },

  getResponsibleUsers: (): Promise<ApiResponse<ResponsibleUser[]>> => {
    return servicesApiClient.get<ResponsibleUser[]>('/kpi/responsible-users')
  },

  create: (data: CreateDepartmentDTO): Promise<ApiResponse<Department>> => {
    return servicesApiClient.post<Department>(BASE_URL, data)
  },

  update: (id: string, data: UpdateDepartmentDTO): Promise<ApiResponse<Department>> => {
    return servicesApiClient.put<Department>(`${BASE_URL}/${id}`, data)
  },

  delete: (id: string): Promise<ApiResponse<any>> => {
    return servicesApiClient.delete(`${BASE_URL}/${id}`)
  },
}
