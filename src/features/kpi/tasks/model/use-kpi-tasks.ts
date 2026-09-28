import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { kpiTasksAPI, CreateKpiTaskDTO, UpdateKpiTaskDTO } from '../api/kpi-tasks.api'
import type { KpiTask, KpiTaskDetail } from '@/entities/kpi'
import { serviceData } from '@/shared/api/services-api-client'

export const KPI_TASKS_KEYS = {
  all: ['kpi-tasks'] as const,
  list: (year: number, quarter: number) => ['kpi-tasks', year, quarter] as const,
  one: (id: string) => ['kpi-task', id] as const,
}

export const useGetKpiTasks = (year: number, quarter: number) =>
  useQuery({
    queryKey: KPI_TASKS_KEYS.list(year, quarter),
    queryFn: async () => serviceData<KpiTask[]>(await kpiTasksAPI.getAll({ year, quarter })) ?? [],
    enabled: !!year && !!quarter,
  })

export const useGetKpiTask = (id: string) =>
  useQuery({
    queryKey: KPI_TASKS_KEYS.one(id),
    queryFn: async () => serviceData<KpiTaskDetail>(await kpiTasksAPI.getOne(id)),
    enabled: !!id,
  })

// Errors are surfaced by the services axios interceptor.
const useKpiMutation = <TVariables>(
  mutationFn: (variables: TVariables) => Promise<unknown>,
  successMessage: string
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: () => {
      toast.success(successMessage)
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: KPI_TASKS_KEYS.all }),
        queryClient.invalidateQueries({ queryKey: ['kpi-task'] }),
      ])
    },
  })
}

export const useCreateKpiTask = () =>
  useKpiMutation<CreateKpiTaskDTO>((data) => kpiTasksAPI.create(data), 'KPI vazifa yaratildi')

export const useUpdateKpiTask = () =>
  useKpiMutation<{ id: string; data: UpdateKpiTaskDTO }>(
    ({ id, data }) => kpiTasksAPI.update(id, data),
    'KPI vazifa yangilandi'
  )

export const useDeleteKpiTask = () => useKpiMutation<string>((id) => kpiTasksAPI.delete(id), 'KPI vazifa o‘chirildi')

export const useApproveResult = () =>
  useKpiMutation<{ indicatorId: string; hr_comment?: string }>(
    ({ indicatorId, hr_comment }) => kpiTasksAPI.approveResult(indicatorId, { hr_comment }),
    'Natija tasdiqlandi'
  )

export const useRejectResult = () =>
  useKpiMutation<{ indicatorId: string; hr_comment: string }>(
    ({ indicatorId, hr_comment }) => kpiTasksAPI.rejectResult(indicatorId, { hr_comment }),
    'Natija qaytarildi'
  )
