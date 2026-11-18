import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { serviceData, servicesApiClient } from '@/shared/api/services-api-client'
import { SERVICES_API_ENDPOINTS } from '@/shared/api/endpoints'
import type {
  AttestationApplication,
  AttestationCalendar,
  AttestationExamSession,
} from '@/entities/attestation/model/types'
import { invalidateAttestation } from '@/entities/attestation/lib/invalidate'

/** A list from the services API, paged or not */
const unwrapList = <T>(response: { data: unknown }): T[] => {
  const payload = serviceData<T[] | { content?: T[] } | null>(response)
  return (Array.isArray(payload) ? payload : payload?.content) ?? []
}

const unwrapOne = <T>(response: { data: unknown }): T => serviceData<T>(response)

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
      unwrapList<AttestationExamSession>(
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
      invalidateAttestation(queryClient)
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

/** The commission chairman's attached E-IMZO signature over the protocol's hash */
export const useSignProtocol = () =>
  useApplicantMutation<{ calendarId: string; sign: string }>(
    ({ calendarId, sign }) =>
      servicesApiClient.post(SERVICES_API_ENDPOINTS.CALENDAR_PROTOCOL_SIGN(calendarId), { sign }),
    'Bayonnoma elektron imzolandi'
  )

/** A scan of the protocol the chairman signed on paper; replaces an earlier scan */
export const useUploadProtocol = () =>
  useApplicantMutation<{ calendarId: string; file: File }>(({ calendarId, file }) => {
    const formData = new FormData()
    formData.append('file', file)

    return servicesApiClient.post(SERVICES_API_ENDPOINTS.CALENDAR_PROTOCOL_UPLOAD(calendarId), formData, {
      'Content-Type': 'multipart/form-data',
    })
  }, 'Imzolangan bayonnoma yuklandi')

/** The upload itself goes through the shared file field; only removal is ours */
export const useDeleteSessionVideo = () =>
  useApplicantMutation<string>(
    (calendarId) => servicesApiClient.delete(SERVICES_API_ENDPOINTS.CALENDAR_VIDEO(calendarId)),
    'Video o‘chirildi'
  )
