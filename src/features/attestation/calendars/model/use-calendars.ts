import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { calendarsAPI, CalendarFilters } from '../api/calendars.api'
import { SERVICES_API_ENDPOINTS } from '@/shared/api/endpoints'
import type { AttestationCalendar, CalendarPayload } from '@/entities/attestation/model/types'

export const CALENDAR_KEYS = {
  all: ['attestation-calendars'] as const,
  list: (filters: CalendarFilters) => ['attestation-calendars', filters] as const,
}

export const useGetCalendars = (filters: CalendarFilters) =>
  useQuery({
    queryKey: CALENDAR_KEYS.list(filters),
    queryFn: async (): Promise<AttestationCalendar[]> => {
      const response = await calendarsAPI.getAll(filters)
      const payload = response.data as any

      return payload?.data ?? []
    },
    enabled: !!filters.from && !!filters.to,
  })

const useCalendarMutation = <TVariables>(
  mutationFn: (variables: TVariables) => Promise<unknown>,
  successMessage: string
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: () => {
      toast.success(successMessage)
      // The table reads through useServicesPaginatedData, which keys by endpoint
      queryClient.invalidateQueries({ queryKey: ['services', SERVICES_API_ENDPOINTS.CALENDARS] })
      queryClient.invalidateQueries({ queryKey: CALENDAR_KEYS.all })
    },
  })
}

export const useCreateCalendar = () =>
  useCalendarMutation<CalendarPayload>((data) => calendarsAPI.create(data), 'Qabul vaqti qo‘shildi')

export const useUpdateCalendar = () =>
  useCalendarMutation<{ id: string; data: CalendarPayload }>(
    ({ id, data }) => calendarsAPI.update(id, data),
    'Qabul vaqti yangilandi'
  )

export const useDeleteCalendar = () =>
  useCalendarMutation<string>((id) => calendarsAPI.remove(id), 'Qabul vaqti o‘chirildi')

export const useCloseCalendar = () => useCalendarMutation<string>((id) => calendarsAPI.close(id), 'Qabul vaqti yopildi')
