import { ComponentType } from 'react';
import { RegisterAccreditationForm } from '../ui/register-accreditation-form';

export const ACCREDITATION_TYPES = {
  REGISTER_ACCREDITATION: 'REGISTER_ACCREDITATION',
};

const accreditationForms: Record<string, ComponentType> = {
  [ACCREDITATION_TYPES.REGISTER_ACCREDITATION]: RegisterAccreditationForm,
};

export const getAccreditationFormByType = (type: string): ComponentType | null => {
  return accreditationForms[type] || null;
};
