import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { servicesApiClient } from '@/shared/api/services-api-client'
import { SERVICES_API_ENDPOINTS } from '@/shared/api/endpoints'
import type {
  AttestationApplication,
  AttestationCalendar,
  AttestationExamSession,
} from '@/entities/attestation/model/types'

const unwrapList = <T>(response: { data: unknown }): T => {
  const payload = response.data as any

  return (payload?.data?.content ?? payload?.data ?? []) as T
}

const unwrapOne = <T>(response: { data: unknown }): T => (response.data as any)?.data as T

export const APPLICANT_KEYS = {
  calendar: (id: string) => ['attestation-calendar', id] as const,
  application: (id: string) => ['attestation-application', id] as const,
  exam: (applicationId: string) => ['attestation-exam', applicationId] as const,
}

export const useCalendar = (calendarId: string) =>
  useQuery({
    queryKey: APPLICANT_KEYS.calendar(calendarId),
    queryFn: async () =>
      unwrapOne<AttestationCalendar>(await servicesApiClient.get(SERVICES_API_ENDPOINTS.CALENDAR_BY_ID(calendarId))),
    enabled: !!calendarId,
  })

export const useApplication = (applicationId: string) =>
  useQuery({
    queryKey: APPLICANT_KEYS.application(applicationId),
    queryFn: async () =>
      unwrapOne<AttestationApplication>(
        await servicesApiClient.get(SERVICES_API_ENDPOINTS.APPLICATION_BY_ID(applicationId))
      ),
    enabled: !!applicationId,
  })

export const useExamQuestions = (applicationId: string, enabled = true) =>
  useQuery({
    queryKey: APPLICANT_KEYS.exam(applicationId),
    queryFn: async () =>
      unwrapList<AttestationExamSession[]>(
        await servicesApiClient.get(SERVICES_API_ENDPOINTS.EXAM_BY_APPLICATION(applicationId))
      ),
    enabled: !!applicationId && enabled,
  })

const useApplicantMutation = <TVariables>(
  mutationFn: (variables: TVariables) => Promise<unknown>,
  successMessage: string
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: () => {
      toast.success(successMessage)
      queryClient.invalidateQueries({ queryKey: ['attestation-application'] })
      queryClient.invalidateQueries({ queryKey: ['attestation-exam'] })
      queryClient.invalidateQueries({ queryKey: ['attestation-calendar'] })
      queryClient.invalidateQueries({ queryKey: ['services'] })
    },
  })
}

export const useGenerateExam = () =>
  useApplicantMutation<string>(
    (applicationId) => servicesApiClient.post(SERVICES_API_ENDPOINTS.EXAM_GENERATE(applicationId), {}),
    'Savollar generatsiya qilindi'
  )

export const useSetResult = () =>
  useApplicantMutation<{ applicationId: string; result: 'PASSED' | 'FAILED' }>(
    ({ applicationId, result }) =>
      servicesApiClient.patch(SERVICES_API_ENDPOINTS.APPLICATION_RESULT(applicationId), { result }),
    'Natija belgilandi'
  )

/** One recording covers the whole session */
export const useUploadSessionVideo = () =>
  useApplicantMutation<{ calendarId: string; file: File }>(({ calendarId, file }) => {
    const formData = new FormData()
    formData.append('video', file)

    return servicesApiClient.post(SERVICES_API_ENDPOINTS.CALENDAR_VIDEO(calendarId), formData as any, {
      'Content-Type': 'multipart/form-data',
    })
  }, 'Video yuklandi')
