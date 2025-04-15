import { lazy, LazyExoticComponent } from 'react';
import { ApplicationTypeEnum } from '@/entities/user/applications/create-application/model/application.types.ts';

const formComponentsMap: Record<string, LazyExoticComponent<any>> = {
  [ApplicationTypeEnum.RegisterLift]: lazy(() => import('../ui/forms/register-lift-form')),
  [ApplicationTypeEnum.RegisterBoiler]: lazy(() => import('../ui/forms/register-boiler-form')),
  [ApplicationTypeEnum.RegisterPressureVesselChemical]: lazy(
    () => import('../ui/forms/register-pressure-vessel-chemical'),
  ),
};

export function getFormComponentByType(type: ApplicationTypeEnum) {
  return formComponentsMap[type] || null;
}

export function isValidApplicationType(type: ApplicationTypeEnum) {
  return type in formComponentsMap;
}
