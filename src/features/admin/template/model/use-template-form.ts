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
  type: TemplateType.IRS_APPEAL,
};

const TEMPLATE_TYPE_MAP: Record<TemplateType, string> = {
  [TemplateType.IRS_APPEAL]: 'INM arizalari',
  [TemplateType.XICHO_APPEAL]: 'XICHO arizalari',
  [TemplateType.EQUIPMENT_APPEAL]: 'Qurilma arizalari',
  [TemplateType.ATTESTATION_LEADER_APPEAL]: 'ATTESTATION_LEADER_APPEAL',
  [TemplateType.ATTESTATION_EMPLOYEE_APPEAL]: 'ATTESTATION_EMPLOYEE_APPEAL',
  [TemplateType.CADASTRE_PASSPORT_APPEAL]: 'CADASTRE_PASSPORT_APPEAL',
  [TemplateType.ATTRACTION_PASSPORT_APPEAL]: 'ATTRACTION_PASSPORT_APPEAL',
  [TemplateType.DECLARATION_APPEAL]: 'DECLARATION_APPEAL',
  [TemplateType.ACCREDITATION_APPEAL]: 'ACCREDITATION_APPEAL',
  [TemplateType.RE_ACCREDITATION_APPEAL]: 'RE_ACCREDITATION_APPEAL',
  [TemplateType.EXPEND_ACCREDITATION_APPEAL]: 'EXPEND_ACCREDITATION_APPEAL',
  [TemplateType.EXPERTISE_CONCLUSION_APPEAL]: 'EXPERTISE_CONCLUSION_APPEAL',
  [TemplateType.REGISTRY_HF]: 'REGISTRY_HF',
  [TemplateType.REGISTRY_EQUIPMENT]: 'REGISTRY_EQUIPMENT',
  [TemplateType.REGISTRY_ATTRACTION]: 'REGISTRY_ATTRACTION',
  [TemplateType.REGISTRY_ATTRACTION_PASSPORT]: 'REGISTRY_ATTRACTION_PASSPORT',
  [TemplateType.REPLY_HF_APPEAL]: 'REPLY_HF_APPEAL',
  [TemplateType.REPLY_IRS_APPEAL]: 'REPLY_IRS_APPEAL',
  [TemplateType.REPLY_EQUIPMENT_APPEAL]: 'REPLY_EQUIPMENT_APPEAL',
  [TemplateType.REPLY_ATTRACTION_PASSPORT_APPEAL]: 'REPLY_ATTRACTION_PASSPORT_APPEAL',
  [TemplateType.REPLY_INSPECTION_REPORT]: 'REPLY_INSPECTION_REPORT',
  [TemplateType.REJECT_APPEAL]: 'REJECT_APPEAL',
  [TemplateType.REPLY_COMMITTEE_TO_APPEAL]: 'REPLY_COMMITTEE_TO_APPEAL',
  [TemplateType.REPLY_REGIONAL_TO_APPEAL]: 'REPLY_REGIONAL_TO_APPEAL',
  [TemplateType.REPLY_ACCEPT_CADASTRE_PASSPORT_APPEAL]: 'REPLY_ACCEPT_CADASTRE_PASSPORT_APPEAL',
  [TemplateType.REPLY_ACCEPT_DECLARATION_APPEAL]: 'REPLY_ACCEPT_DECLARATION_APPEAL',
  [TemplateType.REPLY_REJECT_CADASTRE_PASSPORT_APPEAL]: 'REPLY_REJECT_CADASTRE_PASSPORT_APPEAL',
  [TemplateType.REPLY_REJECT_DECLARATION_APPEAL]: 'REPLY_REJECT_DECLARATION_APPEAL',
} as const;

export const getTemplateType = (type: TemplateType): string => TEMPLATE_TYPE_MAP[type] || 'Ariza';

export function useTemplateForm() {
  const { data, onClose, isCreate } = useTemplateDrawer();

  const templateTypes = useTranslatedObject(TemplateType, 'templates');

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

  const handleSubmit = async (formData: any): Promise<boolean> => {
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
  };

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
