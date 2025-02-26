import { UseFormReturn } from 'react-hook-form';
import { RegisterHPOForm } from './register-hpo';
import { RegisterCrane } from './register-crane';
import { RegisterPressureVesselChemical } from './register-pressure-vessel-chemical';
import { ApplicationTypeEnum } from '@/entities/user/applications/model/application.types';

interface Props {
  form: UseFormReturn<any>;
  applicationType: ApplicationTypeEnum;
}

export const DynamicApplicationForm = ({ applicationType, form }: Props) => {
  switch (applicationType) {
    case ApplicationTypeEnum.RegisterHPO:
      return <RegisterHPOForm form={form} />;
    case ApplicationTypeEnum.RegisterCrane:
      return <RegisterCrane form={form} />;
    case ApplicationTypeEnum.RegisterPressureVesselChemical:
      return <RegisterPressureVesselChemical form={form} />;
    default:
      return null;
  }
};
