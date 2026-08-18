import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { myKpiAPI, SaveResultDTO } from '../api/my-kpi.api'
import type { KpiTaskDetail } from '@/entities/kpi'

export const MY_KPI_KEYS = {
  task: (year: number, quarter: number) => ['my-kpi-task', year, quarter] as const,
}

// The API returns `data: null` when no task is set for the quarter.
export const useGetMyKpiTask = (year: number, quarter: number) => {
  return useQuery({
    queryKey: MY_KPI_KEYS.task(year, quarter),
    queryFn: async (): Promise<KpiTaskDetail | null> => {
      const response = await myKpiAPI.getMyTask({ year, quarter })
      const payload = response.data as any

      return (payload?.data ?? null) as KpiTaskDetail | null
    },
    enabled: !!year && !!quarter,
    retry: false,
  })
}

const useResultMutation = <TVariables>(
  mutationFn: (variables: TVariables) => Promise<unknown>,
  successMessage: string,
  year: number,
  quarter: number
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: () => {
      toast.success(successMessage)
      queryClient.invalidateQueries({ queryKey: MY_KPI_KEYS.task(year, quarter) })
    },
    // Errors are already surfaced by the services axios interceptor
  })
}

export const useCreateResult = (year: number, quarter: number) =>
  useResultMutation<{ indicatorId: string; dto: SaveResultDTO }>(
    ({ indicatorId, dto }) => myKpiAPI.createResult(indicatorId, dto),
    'Natija saqlandi',
    year,
    quarter
  )

export const useUpdateResult = (year: number, quarter: number) =>
  useResultMutation<{ resultId: string; dto: SaveResultDTO }>(
    ({ resultId, dto }) => myKpiAPI.updateResult(resultId, dto),
    'Natija yangilandi',
    year,
    quarter
  )

export const useSubmitKpiTask = (year: number, quarter: number) =>
  useResultMutation<string>((taskId) => myKpiAPI.submitTask(taskId), 'Natijalar tasdiqlashga yuborildi', year, quarter)
