import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { AttestationEmployee, CreateApplicationPayload } from '@/entities/attestation/model/types'
import { invalidateAttestation } from '@/entities/attestation/lib/invalidate'
import { applicationsAPI } from '../api/applications.api'

const unwrap = <T>(response: { data: unknown }): T => {
  const payload = response.data as any

  return (payload?.data?.content ?? payload?.data ?? []) as T
}

export const useOrganizationEmployees = (enabled = true) =>
  useQuery({
    queryKey: ['attestation-employees'],
    queryFn: async () => unwrap<AttestationEmployee[]>(await applicationsAPI.getEmployees()),
    enabled,
    staleTime: 5 * 60 * 1000,
  })

export const useCreateApplication = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateApplicationPayload) => applicationsAPI.create(data),
    onSuccess: () => {
      toast.success('Ariza yuborildi')
      invalidateAttestation(queryClient)
    },
  })
}
