import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  departmentsAPI,
  CreateDepartmentDTO,
  UpdateDepartmentDTO,
  Department,
  ResponsibleUser,
} from '../api/departments.api'
import { toast } from 'sonner'

export const DEPARTMENTS_KEYS = {
  all: ['kpi-departments'] as const,
  responsibleUsers: ['kpi-responsible-users'] as const,
}

export const useGetDepartments = () => {
  return useQuery({
    queryKey: DEPARTMENTS_KEYS.all,
    queryFn: async () => {
      const response = await departmentsAPI.getAll()
      const payload = response.data as any
      return (payload?.data ?? payload) as Department[]
    },
  })
}

export const useGetResponsibleUsers = () => {
  return useQuery({
    queryKey: DEPARTMENTS_KEYS.responsibleUsers,
    queryFn: async () => {
      const response = await departmentsAPI.getResponsibleUsers()
      const payload = response.data as any
      return (payload?.data ?? payload) as ResponsibleUser[]
    },
  })
}

export const useCreateDepartment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateDepartmentDTO) => departmentsAPI.create(data),
    onSuccess: () => {
      toast.success('Bo‘lim qo‘shildi')
      queryClient.invalidateQueries({ queryKey: DEPARTMENTS_KEYS.all })
    },
  })
}

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDepartmentDTO }) => departmentsAPI.update(id, data),
    onSuccess: () => {
      toast.success('Bo‘lim yangilandi')
      queryClient.invalidateQueries({ queryKey: DEPARTMENTS_KEYS.all })
    },
  })
}

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => departmentsAPI.delete(id),
    onSuccess: () => {
      toast.success('Bo‘lim o‘chirildi')
      queryClient.invalidateQueries({ queryKey: DEPARTMENTS_KEYS.all })
    },
    onError: (error: any) => {
      if (error?.status === 422) {
        toast.error('Bu bo‘limga biriktirilgan vazifalar bor. Avval vazifalarni o‘chiring.')
      } else {
        toast.error(error?.message || 'Bo‘limni o‘chirishda xatolik yuz berdi')
      }
    },
  })
}
