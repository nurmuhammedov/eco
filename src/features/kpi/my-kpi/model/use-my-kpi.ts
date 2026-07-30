import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { myKpiAPI, CreateResultDTO, UpdateResultDTO } from '../api/my-kpi.api'
import { toast } from 'sonner'

export const MY_KPI_KEYS = {
  task: (year: number, quarter: number) => ['my-kpi-task', year, quarter] as const,
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const useGetMyKpiTask = (year: number, quarter: number) => {
  return useQuery({
    queryKey: MY_KPI_KEYS.task(year, quarter),
    queryFn: async () => {
      const response = await myKpiAPI.getMyTask({ year, quarter })
      const payload = response.data as any
      // Backend: { success: true, data: { id, year, ... } }
      return (payload?.data ?? payload) as import('../api/my-kpi.api').MyKpiTask | null
    },
    enabled: !!year && !!quarter,
  })
}

export const useCreateResult = (year: number, quarter: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateResultDTO) => myKpiAPI.createResult(dto),
    onSuccess: () => {
      toast.success('Natija muvaffaqiyatli saqlandi')
      queryClient.invalidateQueries({ queryKey: MY_KPI_KEYS.task(year, quarter) })
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Natijani saqlashda xatolik yuz berdi')
    },
  })
}

export const useUpdateResult = (year: number, quarter: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ resultId, dto }: { resultId: string; dto: UpdateResultDTO }) => myKpiAPI.updateResult(resultId, dto),
    onSuccess: () => {
      toast.success('Natija muvaffaqiyatli yangilandi')
      queryClient.invalidateQueries({ queryKey: MY_KPI_KEYS.task(year, quarter) })
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Natijani yangilashda xatolik yuz berdi')
    },
  })
}

export const useSubmitKpiTask = (year: number, quarter: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (taskId: string) => myKpiAPI.submitTask(taskId),
    onSuccess: () => {
      toast.success('KPI natijalari HR ga yuborildi!')
      queryClient.invalidateQueries({ queryKey: MY_KPI_KEYS.task(year, quarter) })
    },
    onError: (error: any) => {
      if (error?.status === 422) {
        toast.error('Barcha indikatorlarga natija kiritilishi shart!')
      } else {
        toast.error(error?.message || 'Yuborishda xatolik yuz berdi')
      }
    },
  })
}
