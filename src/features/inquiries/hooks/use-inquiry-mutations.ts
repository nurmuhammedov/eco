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

export function useAccountantRecoveredAmount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: inquiryApi.postRecoveredAmount,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['/inquiries'] })
      toast.success('Muvaffaqiyatli saqlandi!')
    },
  })
}

export function useAccountantPaidReward() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: inquiryApi.postPaidReward,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['/inquiries'] })
      toast.success('Muvaffaqiyatli saqlandi!')
    },
  })
}

export function useAccountantMibStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: inquiryApi.postMibStatus,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['/inquiries'] })
      toast.success('Muvaffaqiyatli saqlandi!')
    },
  })
}

export function useAccountantComplete() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: inquiryApi.postCompleteAccountant,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['/inquiries'] })
      toast.success('Yakunlandi!')
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
