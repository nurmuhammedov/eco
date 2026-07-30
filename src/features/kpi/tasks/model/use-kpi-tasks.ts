import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { kpiTasksAPI, CreateKpiTaskDTO, UpdateKpiTaskDTO } from '../api/kpi-tasks.api'
import { toast } from 'sonner'

export const KPI_TASKS_KEYS = {
  all: (year: number, quarter: number) => ['kpi-tasks', year, quarter] as const,
  one: (id: string) => ['kpi-task', id] as const,
}

export const useGetKpiTasks = (year: number, quarter: number) => {
  return useQuery({
    queryKey: KPI_TASKS_KEYS.all(year, quarter),
    queryFn: async () => {
      const response = await kpiTasksAPI.getAll({ year, quarter })
      const payload = response.data as any
      return (payload?.data ?? payload) as any[]
    },
    enabled: !!year && !!quarter,
  })
}

export const useGetKpiTask = (id: string) => {
  return useQuery({
    queryKey: KPI_TASKS_KEYS.one(id),
    queryFn: async () => {
      const response = await kpiTasksAPI.getOne(id)
      const payload = response.data as any
      return payload?.data ?? payload
    },
    enabled: !!id,
  })
}

export const useCreateKpiTask = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateKpiTaskDTO) => kpiTasksAPI.create(data),
    onSuccess: () => {
      toast.success('KPI vazifa muvaffaqiyatli yaratildi')
      queryClient.invalidateQueries({ queryKey: ['kpi-tasks'] })
    },
    onError: (error: any) => {
      if (error?.status === 422) {
        toast.error(error?.message || "Indikatorlar vazni yig'indisi 100% bo'lishi shart!")
      } else {
        toast.error(error?.message || 'Xatolik yuz berdi')
      }
    },
  })
}

export const useUpdateKpiTask = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateKpiTaskDTO }) => kpiTasksAPI.update(id, data),
    onSuccess: () => {
      toast.success('KPI vazifa muvaffaqiyatli yangilandi')
      queryClient.invalidateQueries({ queryKey: ['kpi-tasks'] })
      queryClient.invalidateQueries({ queryKey: ['kpi-task'] })
    },
    onError: (error: any) => {
      if (error?.status === 422) {
        toast.error('Bu vazifaga natija kiritilgan. Tahrirlash mumkin emas!')
      } else {
        toast.error(error?.message || 'Xatolik yuz berdi')
      }
    },
  })
}

export const useDeleteKpiTask = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => kpiTasksAPI.delete(id),
    onSuccess: () => {
      toast.success("KPI vazifa muvaffaqiyatli o'chirildi")
      queryClient.invalidateQueries({ queryKey: ['kpi-tasks'] })
    },
    onError: (error: any) => {
      if (error?.status === 422) {
        toast.error("Bu vazifaga natija kiritilgan. O'chirib bo'lmaydi!")
      } else {
        toast.error(error?.message || 'Xatolik yuz berdi')
      }
    },
  })
}

export const useApproveResult = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ indicatorId, hr_comment }: { indicatorId: string; hr_comment?: string }) =>
      kpiTasksAPI.approveResult(indicatorId, { hr_comment }),
    onSuccess: () => {
      toast.success('Natija muvaffaqiyatli tasdiqlandi')
      queryClient.invalidateQueries({ queryKey: ['kpi-task'] })
      queryClient.invalidateQueries({ queryKey: ['kpi-tasks'] })
    },
    onError: (error: any) => {
      const msg = error?.message || error?.data?.message || 'Tasdiqlashda xatolik yuz berdi'
      toast.error(msg)
    },
  })
}

export const useRejectResult = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ indicatorId, hr_comment }: { indicatorId: string; hr_comment: string }) =>
      kpiTasksAPI.rejectResult(indicatorId, { hr_comment }),
    onSuccess: () => {
      toast.success('Natija muvaffaqiyatli rad etildi')
      queryClient.invalidateQueries({ queryKey: ['kpi-task'] })
      queryClient.invalidateQueries({ queryKey: ['kpi-tasks'] })
    },
    onError: (error: any) => {
      const msg = error?.message || error?.data?.message || 'Rad etishda xatolik yuz berdi'
      toast.error(msg)
    },
  })
}
