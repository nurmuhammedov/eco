import { useMutation, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAuth } from '@/shared/hooks/use-auth'
import { belongsToEndpoint, endpointKey, invalidateEndpoint } from '@/shared/lib/query/endpoint-key'
import { UserRoles } from '@/shared/types/user'
import {
  ATTENDANCE_ENDPOINT,
  attendanceAPI,
  type AbsenceDTO,
  type AttendanceFilters,
  type CorrectionDTO,
  type HolidayDTO,
  type ScheduleDTO,
} from '../api/attendance.api'

/** HR and the administrator enter what the terminals cannot know */
const MANAGER_ROLES: string[] = [UserRoles.ADMIN, UserRoles.HR]

/**
 * Who does what here. A regional head sees only their own division: the
 * server narrows every report to it, so the division picker is not offered.
 */
export const useAttendanceAccess = () => {
  const { user } = useAuth()

  return {
    canManage: MANAGER_ROLES.includes(user?.role ?? ''),
    isRegional: user?.role === UserRoles.REGIONAL,
  }
}

/** The month's filters as the API reads them; an empty division means all */
const params = ({ year, month, division, search }: AttendanceFilters) => ({
  year,
  month,
  division: division || undefined,
  search: search || undefined,
})

/**
 * Everything the module shows hangs off one prefix. The paged log is keyed as
 * ['services', endpoint, …] by the shared hook, so it is matched by its second part.
 */
const invalidateAttendance = (queryClient: QueryClient) =>
  Promise.all([
    invalidateEndpoint(queryClient, ATTENDANCE_ENDPOINT),
    queryClient.invalidateQueries({
      predicate: ({ queryKey }) =>
        queryKey[0] === 'services' && belongsToEndpoint(queryKey.slice(1), ATTENDANCE_ENDPOINT),
    }),
  ])

export const useAttendanceDivisions = () =>
  useQuery({
    queryKey: endpointKey('/attendance/divisions'),
    queryFn: attendanceAPI.divisions,
    staleTime: 5 * 60 * 1000,
  })

export const useAttendanceSettings = () =>
  useQuery({
    queryKey: endpointKey('/attendance/codes'),
    queryFn: async () => (await attendanceAPI.codes()).settings,
    staleTime: 60 * 60 * 1000,
  })

export const useTimesheet = (filters: AttendanceFilters) =>
  useQuery({
    queryKey: endpointKey('/attendance/timesheet', params(filters)),
    queryFn: () => attendanceAPI.timesheet(params(filters)),
    placeholderData: (previous) => previous,
  })

export const useAttendanceSummary = (filters: AttendanceFilters) =>
  useQuery({
    queryKey: endpointKey('/attendance/summary', params(filters)),
    queryFn: () => attendanceAPI.summary(params(filters)),
    placeholderData: (previous) => previous,
  })

export const useEmployeeAttendance = (userId: string | undefined, year: number, month: number) =>
  useQuery({
    queryKey: endpointKey('/attendance/employees', userId, year, month),
    queryFn: () => attendanceAPI.employee(userId as string, { year, month }),
    enabled: !!userId,
    placeholderData: (previous) => previous,
  })

export const useAttendanceStaff = (filters: { division?: string; search?: string }, enabled = true) =>
  useQuery({
    queryKey: endpointKey('/attendance/staff', filters),
    queryFn: () =>
      attendanceAPI.staff({ division: filters.division || undefined, search: filters.search || undefined }),
    enabled,
    staleTime: 60 * 1000,
  })

export const useAttendanceAbsences = (filters: AttendanceFilters) =>
  useQuery({
    queryKey: endpointKey('/attendance/absences', params(filters)),
    queryFn: () => attendanceAPI.absences(params(filters)),
  })

export const useAttendanceHolidays = (year: number) =>
  useQuery({
    queryKey: endpointKey('/attendance/holidays', year),
    queryFn: () => attendanceAPI.holidays(year),
  })

export const useAttendanceCorrections = (filters: AttendanceFilters) =>
  useQuery({
    queryKey: endpointKey('/attendance/corrections', params(filters)),
    queryFn: () => attendanceAPI.corrections(params(filters)),
  })

/** The server words its own outcome ("Yozuv qo‘shildi."); the fallback is for an empty body */
const serverMessage = (response: unknown) => (response as { data?: { message?: string } } | undefined)?.data?.message

const useAttendanceMutation = <TVariables>(
  mutationFn: (variables: TVariables) => Promise<unknown>,
  fallback: string
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: async (response) => {
      await invalidateAttendance(queryClient)
      toast.success(serverMessage(response) ?? fallback)
    },
  })
}

export const useSaveSchedule = () =>
  useAttendanceMutation(
    ({ userId, data }: { userId: string; data: ScheduleDTO }) => attendanceAPI.saveSchedule(userId, data),
    'Grafik saqlandi.'
  )

export const useSaveAbsence = () =>
  useAttendanceMutation(
    ({ id, data }: { id?: number; data: AbsenceDTO }) =>
      id ? attendanceAPI.updateAbsence(id, data) : attendanceAPI.createAbsence(data),
    'Yozuv saqlandi.'
  )

export const useDeleteAbsence = () =>
  useAttendanceMutation((id: number) => attendanceAPI.deleteAbsence(id), 'Yozuv o‘chirildi.')

export const useCreateHoliday = () =>
  useAttendanceMutation((data: HolidayDTO) => attendanceAPI.createHoliday(data), 'Kun qo‘shildi.')

export const useDeleteHoliday = () =>
  useAttendanceMutation((id: number) => attendanceAPI.deleteHoliday(id), 'Kun o‘chirildi.')

export const useSaveCorrection = () =>
  useAttendanceMutation((data: CorrectionDTO) => attendanceAPI.saveCorrection(data), 'Kun holati saqlandi.')

export const useDeleteCorrection = () =>
  useAttendanceMutation((id: number) => attendanceAPI.deleteCorrection(id), 'Tuzatish bekor qilindi.')
