import { preventionAPI } from '@/entities/prevention'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useCreatePrevention = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: preventionAPI.create,
    onSuccess: async () => {
      toast.success("Profilaktika tadbiri muvaffaqiyatli qo'shildi")
      await queryClient.invalidateQueries({ queryKey: ['preventions'] })
    },
  })
}

export const useDeletePrevention = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => preventionAPI.delete(id),
    onSuccess: async () => {
      toast.success("Profilaktika tadbiri o'chirildi")
      await queryClient.invalidateQueries({ queryKey: ['preventions'] })
    },
  })
}

export const useUploadPreventionFile = (form: any) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: preventionAPI.uploadPreventionFile,
    onSuccess: async () => {
      form.reset()
      toast.success('Reja fayli muvaffaqiyatli yuklandi')
      await queryClient.invalidateQueries({ queryKey: ['prevention-file'] })
    },
  })
}

export const useDeletePreventionFile = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (year: string | undefined) => preventionAPI.deletePreventionFile(year),
    onSuccess: async () => {
      toast.success("Reja fayli o'chirildi")
      await queryClient.invalidateQueries({ queryKey: ['prevention-file'] })
    },
  })
}
