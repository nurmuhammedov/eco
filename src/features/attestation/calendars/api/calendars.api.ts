import { servicesApiClient } from '@/shared/api/services-api-client'
import { SERVICES_API_ENDPOINTS } from '@/shared/api/endpoints'
import type { AttestationCalendar, CalendarPayload, CreateExamPayload } from '@/entities/attestation/model/types'

export const calendarsAPI = {
  create: (data: CreateExamPayload) =>
    servicesApiClient.post<AttestationCalendar>(SERVICES_API_ENDPOINTS.CALENDARS, data),

  update: (id: string, data: CalendarPayload) =>
    servicesApiClient.put<AttestationCalendar>(SERVICES_API_ENDPOINTS.CALENDAR_BY_ID(id), data),

  remove: (id: string) => servicesApiClient.delete(SERVICES_API_ENDPOINTS.CALENDAR_BY_ID(id)),

  attach: (id: string, applicationIds: string[]) =>
    servicesApiClient.post(SERVICES_API_ENDPOINTS.CALENDAR_APPLICATIONS(id), { application_ids: applicationIds }),

  detach: (id: string, applicationId: string) =>
    servicesApiClient.delete(SERVICES_API_ENDPOINTS.CALENDAR_APPLICATION(id, applicationId)),
}
