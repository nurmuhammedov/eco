import { useMutation, useQueryClient } from '@tanstack/react-query'
import { inquiryApi } from '@/features/inquiries/model/inquiry.api'
import { toast } from 'sonner'

export function useSetInspector() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: inquiryApi.setInspector,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['/inquiries'] })
      toast.success('Muvaffaqiyatli saqlandi!')
    },
  })
}

export function useExecuteInitial() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: inquiryApi.executeInitial,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['/inquiries'] })
      toast.success('Muvaffaqiyatli saqlandi!')
    },
  })
}

export function useExecuteCourt() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: inquiryApi.executeCourt,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['/inquiries'] })
      toast.success('Muvaffaqiyatli saqlandi!')
    },
  })
}

export function useExecutePayment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: inquiryApi.executePayment,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['/inquiries'] })
      toast.success('Muvaffaqiyatli saqlandi!')
    },
  })
}

export function useDeleteInquiry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: inquiryApi.deleteInquiry,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['/inquiries'] })
      toast.success('Muvaffaqiyatli o‘chirildi!')
    },
  })
}
