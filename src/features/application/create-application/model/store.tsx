import { ApplicationTypeEnum } from '@/entities/create-application';
import { ComponentType, lazy, LazyExoticComponent } from 'react';

export interface FormComponentProps {
  onSubmit: (data: any) => void;
}

const formComponentsMap: Record<string, LazyExoticComponent<ComponentType<FormComponentProps>>> = {
  [ApplicationTypeEnum.REGISTER_HF]: lazy(() => import('../ui/forms/register-hpo-form')),
  [ApplicationTypeEnum.REGISTER_ELEVATOR]: lazy(() => import('../ui/forms/register-lift-form')),
  [ApplicationTypeEnum.REGISTER_CRANE]: lazy(() => import('../ui/forms/register-crane-form')),
  [ApplicationTypeEnum.REGISTER_CONTAINER]: lazy(() => import('../ui/forms/register-container-form')),
  [ApplicationTypeEnum.REGISTER_BOILER]: lazy(() => import('../ui/forms/register-boiler-form')),
  [ApplicationTypeEnum.REGISTER_ESCALATOR]: lazy(() => import('../ui/forms/register-escalator-form')),
  [ApplicationTypeEnum.REGISTER_PIPELINE]: lazy(() => import('../ui/forms/register-pipeline-form')),
  [ApplicationTypeEnum.REGISTER_CHEMICAL_CONTAINER]: lazy(() => import('../ui/forms/register-chemical-container-form')),
  [ApplicationTypeEnum.REGISTER_HEAT_PIPELINE]: lazy(() => import('../ui/forms/register-heat-pipeline-form')),
  [ApplicationTypeEnum.REGISTER_BOILER_UTILIZER]: lazy(() => import('../ui/forms/register-boiler-utilizer-form')),
  [ApplicationTypeEnum.REGISTER_LPG_CONTAINER]: lazy(() => import('../ui/forms/register-lpg-container-form')),
  [ApplicationTypeEnum.REGISTER_LPG_POWERED]: lazy(() => import('../ui/forms/register-lpg-powered-form')),
  [ApplicationTypeEnum.REGISTER_HOIST]: lazy(() => import('../ui/forms/register-hoist-form')),
  [ApplicationTypeEnum.REGISTER_CABLEWAY]: lazy(() => import('../ui/forms/register-cableway-form')),
  [ApplicationTypeEnum.REGISTER_IRS]: lazy(() => import('../ui/forms/register-irs-form')),
};

export function getFormComponentByType(
  type: ApplicationTypeEnum,
): LazyExoticComponent<ComponentType<FormComponentProps>> | null {
  return formComponentsMap[type] || null;
}

export function isValidApplicationType(type: ApplicationTypeEnum) {
  return type in formComponentsMap;
}
