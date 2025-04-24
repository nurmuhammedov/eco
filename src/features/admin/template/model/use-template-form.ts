import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useMemo } from 'react';
import { useTemplateDrawer } from '@/shared/hooks/entity-hooks';
import {
  TemplateFormDTO,
  templateFormSchema,
  TemplateType,
  useCreateTemplate,
  useTemplate,
  useUpdateTemplateData,
} from '@/entities/admin/template';
import { useTranslatedObject } from '@/shared/hooks';
import { getSelectOptions } from '@/shared/lib/get-select-options.tsx';

const DEFAULT_FORM_VALUES = {
  name: '',
  description: '',
  type: TemplateType.IRS,
};

const TEMPLATE_TYPE_MAP: Record<TemplateType, string> = {
  [TemplateType.IRS]: 'INM arizalari',
  [TemplateType.XICHO_APPEAL]: 'XICHO arizalari',
  [TemplateType.EQUIPMENT_APPEAL]: 'Qurilma arizalari',
} as const;

export const getTemplateType = (type: TemplateType): string => TEMPLATE_TYPE_MAP[type] || 'Ariza';

export function useTemplateForm() {
  const { data, onClose, isCreate } = useTemplateDrawer();

  const templateTypes = useTranslatedObject(TemplateType);

  const templateTypeOptions = getSelectOptions(templateTypes);

  const templateId = useMemo(() => (data?.id ? data?.id : 0), [data]);

  const form = useForm<TemplateFormDTO>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: DEFAULT_FORM_VALUES,
    mode: 'onChange',
  });

  const { data: foundData, isLoading } = useTemplate(templateId);

  const { mutateAsync: createTemplate, isPending: isCreating } = useCreateTemplate();

  const { mutateAsync: updateTemplate, isPending: isUpdating } = useUpdateTemplateData();

  useEffect(() => {
    if (foundData && !isCreate) {
      form.reset(foundData);
    }
  }, [foundData, isCreate, form]);

  const handleClose = useCallback(() => {
    form.reset(DEFAULT_FORM_VALUES);
    onClose();
  }, [form, onClose]);

  const handleSubmit = useCallback(
    async (formData: any): Promise<boolean> => {
      try {
        if (isCreate) {
          const response = await createTemplate(formData);
          if (response.success) {
            handleClose();
            return true;
          }
        } else {
          const response = await updateTemplate({
            id: templateId,
            ...formData,
          });
          if (response.success) {
            handleClose();
            return true;
          }
        }

        return false;
      } catch (error) {
        console.error('[useTemplateForm] Submission error:', error);
        return false;
      }
    },
    [isCreate, templateId, createTemplate, updateTemplate, handleClose],
  );

  const isPending = isCreating || isUpdating;

  return {
    form,
    isCreate,
    isPending,
    foundData,
    templateTypeOptions,
    onSubmit: handleSubmit,
    isFetching: isLoading,
  };
}
