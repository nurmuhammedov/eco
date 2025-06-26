// src/features/accreditation/create/lib/get-accreditation-form-by-type.ts

import { ApplicationTypeEnum } from '@/entities/create-application';
import { ComponentType, lazy } from 'react';

const accreditationForms: Record<string, ComponentType<any>> = {
  [ApplicationTypeEnum.REGISTER_ACCREDITATION]: lazy(() =>
    import('../ui/register-accreditation-form').then((module) => ({ default: module.RegisterAccreditationForm })),
  ),
  [ApplicationTypeEnum.RE_REGISTER_ACCREDITATION]: lazy(() =>
    import('../ui/register-re-accreditation-form').then((module) => ({ default: module.RegisterReAccreditationForm })),
  ),
  [ApplicationTypeEnum.EXPAND_ACCREDITATION]: lazy(() =>
    import('../ui/register-expand-accreditation-form').then((module) => ({
      default: module.RegisterExpandAccreditationForm,
    })),
  ),
};

export const getAccreditationFormByType = (type: string): ComponentType | null => {
  return accreditationForms[type] || null;
};
