import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { SERVICES_API_ENDPOINTS } from '@/shared/api/endpoints'
import type {
  AttestationCalendar,
  AttestationEmployee,
  CreateApplicationPayload,
  EmployeeType,
} from '@/entities/attestation/model/types'
import { applicationsAPI } from '../api/applications.api'

const unwrap = <T>(response: { data: unknown }): T => {
  const payload = response.data as any

  return (payload?.data?.content ?? payload?.data ?? []) as T
}

export const useAvailableDates = (employeeType?: EmployeeType, enabled = true) =>
  useQuery({
    queryKey: ['attestation-available-dates', employeeType],
    queryFn: async () =>
      unwrap<AttestationCalendar[]>(
        await applicationsAPI.getAvailableDates(employeeType ? { employee_type: employeeType } : undefined)
      ),
    enabled,
  })

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
      queryClient.invalidateQueries({ queryKey: ['services', SERVICES_API_ENDPOINTS.MY_APPLICATIONS] })
      queryClient.invalidateQueries({ queryKey: ['attestation-available-dates'] })
      queryClient.invalidateQueries({ queryKey: ['attestation-employees'] })
    },
  })
}
