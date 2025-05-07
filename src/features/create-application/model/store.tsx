import { ComponentType, lazy, LazyExoticComponent } from 'react';
import { ApplicationTypeEnum } from '@/entities/create-application';

export interface FormComponentProps {
  onSubmit: (data: any) => void;
}

// Update the formComponentsMap type to be more specific about component props
const formComponentsMap: Record<string, LazyExoticComponent<ComponentType<FormComponentProps>>> = {
  [ApplicationTypeEnum.RegisterHPO]: lazy(() => import('../ui/forms/register-hpo-form')),
  [ApplicationTypeEnum.RegisterLift]: lazy(() => import('../ui/forms/register-lift-form')),
  [ApplicationTypeEnum.RegisterCrane]: lazy(() => import('../ui/forms/register-crane-form')),
  [ApplicationTypeEnum.RegisterBoiler]: lazy(() => import('../ui/forms/register-boiler-form')),
  [ApplicationTypeEnum.RegisterSteamAndHotWaterPipeline]: lazy(() => import('../ui/forms/register-boiler-form')),
  [ApplicationTypeEnum.RegisterPressureVesselChemical]: lazy(
    () => import('../ui/forms/register-pressure-vessel-chemical'),
  ),
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
