import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { templateAPI, TemplateFormDTO } from '@/entities/admin/template';
import { toast } from 'sonner';

export const templateKeys = {
  all: ['templates'] as const,
  lists: () => [...templateKeys.all, 'list'] as const,
  list: (filters: string) => [...templateKeys.lists(), { filters }] as const,
  details: () => [...templateKeys.all, 'detail'] as const,
  detail: (id: number) => [...templateKeys.details(), id] as const,
};

export const useTemplates = () => {
  return useQuery({
    queryKey: templateKeys.lists(),
    queryFn: templateAPI.list,
  });
};

export const useTemplate = (id: number) => {
  return useQuery({
    queryKey: templateKeys.detail(id),
    queryFn: () => templateAPI.byId(id),
    enabled: !!id,
  });
};

export const useCreateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TemplateFormDTO) => templateAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
      toast.success('Shablon muvaffaqqiyatli yaratildi');
    },
    onError: (error) => toast.error(error.message, { richColors: true }),
  });
};

export const useUpdateTemplateData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<TemplateFormDTO> }) => templateAPI.updateData(id, data),
    onSuccess: (updatedTemplate) => {
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: templateKeys.detail(updatedTemplate.data.id),
      });
      toast.success('Shablon muvaffaqqiyatli tahrirlandi');
    },
    onError: (error) => toast.error(error.message, { richColors: true }),
  });
};
export const useUpdateTemplateContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<TemplateFormDTO> }) => templateAPI.updateContent(id, data),
    onSuccess: (updatedTemplate) => {
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: templateKeys.detail(updatedTemplate.data.id),
      });
      toast.success('Shablon muvaffaqqiyatli tahrirlandi');
    },
    onError: (error) => toast.error(error.message, { richColors: true }),
  });
};
