import { servicesApiClient } from '@/shared/api/services-api-client'
import { SERVICES_API_ENDPOINTS } from '@/shared/api/endpoints'
import type {
  AttestationCalendar,
  AttestationEmployee,
  CreateApplicationPayload,
  EmployeeType,
} from '@/entities/attestation/model/types'

export const applicationsAPI = {
  /** Sessions still open for applications */
  getAvailableDates: (params?: { employee_type?: EmployeeType }) =>
    servicesApiClient.get<AttestationCalendar[]>(SERVICES_API_ENDPOINTS.AVAILABLE_DATES, params),

  /** Staff of the organization, from the partner training system */
  getEmployees: () => servicesApiClient.get<AttestationEmployee[]>(SERVICES_API_ENDPOINTS.EMPLOYEES),

  create: (data: CreateApplicationPayload) => servicesApiClient.post(SERVICES_API_ENDPOINTS.APPLICATIONS, data),
}
