import { ApplicationTypeEnum } from '@/entities/create-application'
import { ComponentType, lazy, LazyExoticComponent } from 'react'

export interface FormComponentProps {
  onSubmit: (data: any) => void
}

const formComponentsMap: Record<string, LazyExoticComponent<ComponentType<FormComponentProps>>> = {
  [ApplicationTypeEnum.REGISTER_HF]: lazy(() => import('../ui/forms/register-hp-form')),
  [ApplicationTypeEnum.DEREGISTER_HF]: lazy(() => import('../ui/forms/deregister-hf-form')),
  [ApplicationTypeEnum.RE_REGISTER_HF]: lazy(() => import('../ui/forms/reregister-hf-form')),
  [ApplicationTypeEnum.RE_REGISTER_ILLEGAL_HF]: lazy(() => import('../ui/forms/reregister-illegal-hf-form')),
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
  [ApplicationTypeEnum.DEREGISTER_EQUIPMENT]: lazy(() => import('../ui/forms/deregister-equipment-form')),
  [ApplicationTypeEnum.ILLEGAL_REGISTER_HF]: lazy(() => import('../ui/forms/register-illegal-hf-form')),
  [ApplicationTypeEnum.REGISTER_IRS]: lazy(() => import('../ui/forms/register-irs-form')),
  [ApplicationTypeEnum.REGISTER_XRAY]: lazy(() => import('../ui/forms/register-xray-form')),
  [ApplicationTypeEnum.RE_REGISTER_EQUIPMENT]: lazy(() => import('../ui/forms/reregister-equipment-form')),
  [ApplicationTypeEnum.REGISTER_ATTRACTION]: lazy(() => import('../ui/forms/register-attraction-form')),
  [ApplicationTypeEnum.ILLEGAL_REGISTER_XRAY]: lazy(() => import('../ui/forms/register-illegal-xray-form')),
  [ApplicationTypeEnum.ILLEGAL_REGISTER_CRANE]: lazy(() => import('../ui/forms/register-illegal-crane-form')),
  [ApplicationTypeEnum.ILLEGAL_REGISTER_CONTAINER]: lazy(() => import('../ui/forms/register-illegal-container-form')),
  [ApplicationTypeEnum.ILLEGAL_REGISTER_BOILER]: lazy(() => import('../ui/forms/register-illegal-boiler-form.tsx')),
  [ApplicationTypeEnum.ILLEGAL_REGISTER_ELEVATOR]: lazy(() => import('../ui/forms/register-illegal-lift-form.tsx')),
  [ApplicationTypeEnum.ILLEGAL_REGISTER_ESCALATOR]: lazy(() => import('../ui/forms/register-illegal-escalator-form')),
  [ApplicationTypeEnum.ILLEGAL_REGISTER_PIPELINE]: lazy(() => import('../ui/forms/register-illegal-pipeline-form')),
  [ApplicationTypeEnum.ILLEGAL_REGISTER_HOIST]: lazy(() => import('../ui/forms/register-illegal-hoist-form')),
  [ApplicationTypeEnum.ILLEGAL_REGISTER_CABLEWAY]: lazy(() => import('../ui/forms/register-illegal-cableway-form')),
  [ApplicationTypeEnum.ILLEGAL_REGISTER_ATTRACTION_PASSPORT]: lazy(
    () => import('../ui/forms/register-illegal-attraction-form')
  ),
  [ApplicationTypeEnum.ILLEGAL_REGISTER_CHEMICAL_CONTAINER]: lazy(
    () => import('../ui/forms/register-illegal-chemical-container-form')
  ),
  [ApplicationTypeEnum.ILLEGAL_REGISTER_HEAT_PIPELINE]: lazy(
    () => import('../ui/forms/register-illegal-heat-pipeline-form')
  ),
  [ApplicationTypeEnum.ILLEGAL_REGISTER_BOILER_UTILIZER]: lazy(
    () => import('../ui/forms/register-illegal-boiler-utilizer-form')
  ),
  [ApplicationTypeEnum.ILLEGAL_REGISTER_LPG_CONTAINER]: lazy(
    () => import('../ui/forms/register-illegal-lpg-container-form')
  ),
  [ApplicationTypeEnum.ILLEGAL_REGISTER_LPG_POWERED]: lazy(
    () => import('../ui/forms/register-illegal-lpg-powered-form')
  ),
}

export function getFormComponentByType(
  type: ApplicationTypeEnum
): LazyExoticComponent<ComponentType<FormComponentProps>> | null {
  return formComponentsMap[type] || null
}

export function isValidApplicationType(type: ApplicationTypeEnum) {
  return type in formComponentsMap
}
