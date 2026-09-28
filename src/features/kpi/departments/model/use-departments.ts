import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  departmentsAPI,
  CreateDepartmentDTO,
  UpdateDepartmentDTO,
  Department,
  ResponsibleUser,
} from '../api/departments.api'
import { toast } from 'sonner'
import { serviceData } from '@/shared/api/services-api-client'

export const DEPARTMENTS_KEYS = {
  all: ['kpi-departments'] as const,
  responsibleUsers: ['kpi-responsible-users'] as const,
}

export const useGetDepartments = () => {
  return useQuery({
    queryKey: DEPARTMENTS_KEYS.all,
    queryFn: async () => {
      return serviceData<Department[]>(await departmentsAPI.getAll())
    },
  })
}

export const useGetResponsibleUsers = () => {
  return useQuery({
    queryKey: DEPARTMENTS_KEYS.responsibleUsers,
    queryFn: async () => {
      return serviceData<ResponsibleUser[]>(await departmentsAPI.getResponsibleUsers())
    },
  })
}

export const useCreateDepartment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateDepartmentDTO) => departmentsAPI.create(data),
    onSuccess: () => {
      toast.success('Bo‘lim qo‘shildi')
      return queryClient.invalidateQueries({ queryKey: DEPARTMENTS_KEYS.all })
    },
  })
}

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDepartmentDTO }) => departmentsAPI.update(id, data),
    onSuccess: () => {
      toast.success('Bo‘lim yangilandi')
      return queryClient.invalidateQueries({ queryKey: DEPARTMENTS_KEYS.all })
    },
  })
}

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => departmentsAPI.delete(id),
    onSuccess: () => {
      toast.success('Bo‘lim o‘chirildi')
      return queryClient.invalidateQueries({ queryKey: DEPARTMENTS_KEYS.all })
    },
    // Every failure is already toasted by the services client; this one also says what to do about it
    onError: (error: { status?: number }) => {
      if (error.status === 422) toast.error('Bu bo‘limga biriktirilgan vazifalar bor. Avval vazifalarni o‘chiring.')
    },
  })
}
