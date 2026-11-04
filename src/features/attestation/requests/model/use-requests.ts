import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { serviceData } from '@/shared/api/services-api-client'
import type { AttestationEmployee, AttestationRequest, SubmitRequestPayload } from '@/entities/attestation/model/types'
import { invalidateAttestation } from '@/entities/attestation/lib/invalidate'
import { requestsAPI } from '../api/requests.api'

/** A list from the services API, paged or not */
const unwrap = <T>(response: { data: unknown }): T[] => {
  const payload = serviceData<T[] | { content?: T[] } | null>(response)
  return (Array.isArray(payload) ? payload : payload?.content) ?? []
}

export const useOrganizationEmployees = (enabled = true) =>
  useQuery({
    queryKey: ['attestation-employees'],
    queryFn: async () => unwrap<AttestationEmployee>(await requestsAPI.getEmployees()),
    enabled,
    staleTime: 5 * 60 * 1000,
  })

/** The commission's view of a request, with its employees */
export const useRequest = (id: string) =>
  useQuery({
    queryKey: ['attestation-request', id],
    queryFn: async () => serviceData<AttestationRequest>(await requestsAPI.getById(id)),
    enabled: !!id,
  })

const useRequestMutation = <TVariables>(
  mutationFn: (variables: TVariables) => Promise<unknown>,
  successMessage: string
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: async () => {
      toast.success(successMessage)
      await invalidateAttestation(queryClient)
    },
  })
}

export const useSubmitRequest = () =>
  useRequestMutation<SubmitRequestPayload>(
    (data) => requestsAPI.submit(data),
    'Ariza yuborildi. Komissiya uni uch ish kunida ko‘rib chiqadi'
  )

export const useAcceptRequest = () =>
  useRequestMutation<string>((id) => requestsAPI.accept(id), 'Xodimlar attestatsiyaga qo‘yildi va navbatga tushdi')

export const useRejectRequest = () =>
  useRequestMutation<{ id: string; reason: string }>(
    ({ id, reason }) => requestsAPI.reject(id, reason),
    'Ariza rad etildi'
  )
