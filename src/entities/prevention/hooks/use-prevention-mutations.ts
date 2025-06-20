import { preventionAPI } from '@/entities/prevention';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useCreatePrevention = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: preventionAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preventions'] });
      toast.success("Profilaktika tadbiri muvaffaqiyatli qo'shildi");
    },
    onError: () => {
      toast.error('Xatolik yuz berdi');
    },
  });
};

export const useDeletePrevention = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => preventionAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preventions'] });
      toast.success("Profilaktika tadbiri o'chirildi");
    },
    onError: () => {
      toast.error('Xatolik yuz berdi');
    },
  });
};

export const useUploadPreventionFile = (form: any) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: preventionAPI.uploadPreventionFile,
    onSuccess: (_) => {
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['prevention-file'] });
      toast.success('Reja fayli muvaffaqiyatli yuklandi');
    },
    onError: () => {
      toast.error('Fayl yuklashda xatolik yuz berdi');
    },
  });
};

export const useDeletePreventionFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (year: string | undefined) => preventionAPI.deletePreventionFile(year),
    onSuccess: (_) => {
      queryClient.invalidateQueries({ queryKey: ['prevention-file'] });
      toast.success("Reja fayli o'chirildi");
    },
    onError: () => {
      toast.error("Faylni o'chirishda xatolik yuz berdi");
    },
  });
};
