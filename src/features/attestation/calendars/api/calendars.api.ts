import { servicesApiClient } from '@/shared/api/services-api-client'
import { SERVICES_API_ENDPOINTS } from '@/shared/api/endpoints'
import type { AttestationCalendar, CalendarPayload, EmployeeType } from '@/entities/attestation/model/types'

export type CalendarFilters = {
  from?: string
  to?: string
  employee_type?: EmployeeType
  status?: string
}

export const calendarsAPI = {
  getAll: (params: CalendarFilters) =>
    servicesApiClient.get<AttestationCalendar[]>(SERVICES_API_ENDPOINTS.CALENDARS, params),

  create: (data: CalendarPayload) =>
    servicesApiClient.post<AttestationCalendar>(SERVICES_API_ENDPOINTS.CALENDARS, data),

  update: (id: string, data: CalendarPayload) =>
    servicesApiClient.put<AttestationCalendar>(SERVICES_API_ENDPOINTS.CALENDAR_BY_ID(id), data),

  remove: (id: string) => servicesApiClient.delete(SERVICES_API_ENDPOINTS.CALENDAR_BY_ID(id)),

  close: (id: string) => servicesApiClient.patch(SERVICES_API_ENDPOINTS.CALENDAR_CLOSE(id), {}),
}
