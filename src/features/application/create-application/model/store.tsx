import { ApplicationTypeEnum } from '@/entities/create-application';
import { ComponentType, lazy, LazyExoticComponent } from 'react';

export interface FormComponentProps {
  onSubmit: (data: any) => void;
}

// Update the formComponentsMap type to be more specific about component props
const formComponentsMap: Record<string, LazyExoticComponent<ComponentType<FormComponentProps>>> = {
  [ApplicationTypeEnum.REGISTER_HF]: lazy(() => import('../ui/forms/register-hpo-form')),
  [ApplicationTypeEnum.REGISTER_ELEVATOR]: lazy(() => import('../ui/forms/register-lift-form')),
  [ApplicationTypeEnum.REGISTER_CRANE]: lazy(() => import('../ui/forms/register-crane-form')),
  [ApplicationTypeEnum.REGISTER_LPG_CONTAINER]: lazy(() => import('../ui/forms/register-pressure-vessel-chemical')),
};

// Update the return type to be specific about the component props
export function getFormComponentByType(
  type: ApplicationTypeEnum,
): LazyExoticComponent<ComponentType<FormComponentProps>> | null {
  return formComponentsMap[type] || null;
}

export function isValidApplicationType(type: ApplicationTypeEnum) {
  return type in formComponentsMap;
}
