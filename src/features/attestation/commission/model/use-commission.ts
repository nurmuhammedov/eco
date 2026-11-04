import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { serviceData, servicesApiClient } from '@/shared/api/services-api-client'
import { SERVICES_API_ENDPOINTS } from '@/shared/api/endpoints'
import type {
  AttestationCommission,
  CommissionMemberPayload,
  CommissionPayload,
  CommissionRole,
} from '@/entities/attestation/model/types'
import { invalidateAttestation } from '@/entities/attestation/lib/invalidate'

/** The examiner's own commission: the central one for the department, the region's for a regional head */
export const useCommission = (enabled = true) =>
  useQuery({
    queryKey: ['attestation-commission'],
    queryFn: async () =>
      serviceData<AttestationCommission>(await servicesApiClient.get(SERVICES_API_ENDPOINTS.COMMISSION)),
    enabled,
  })

const useCommissionMutation = <TVariables>(
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

export const useUpdateCommission = () =>
  useCommissionMutation<CommissionPayload>(
    (data) => servicesApiClient.put(SERVICES_API_ENDPOINTS.COMMISSION, data),
    'Komissiya ma’lumotlari saqlandi'
  )

export const useAddCommissionMember = () =>
  useCommissionMutation<CommissionMemberPayload>(
    (data) => servicesApiClient.post(SERVICES_API_ENDPOINTS.COMMISSION_MEMBERS, data),
    'Komissiya a’zosi qo‘shildi'
  )

export const useUpdateCommissionMember = () =>
  useCommissionMutation<{ id: string; position: string; role: CommissionRole }>(
    ({ id, ...data }) => servicesApiClient.put(SERVICES_API_ENDPOINTS.COMMISSION_MEMBER(id), data),
    'Komissiya a’zosi yangilandi'
  )

export const useRemoveCommissionMember = () =>
  useCommissionMutation<string>(
    (id) => servicesApiClient.delete(SERVICES_API_ENDPOINTS.COMMISSION_MEMBER(id)),
    'Komissiya a’zosi chiqarildi'
  )
