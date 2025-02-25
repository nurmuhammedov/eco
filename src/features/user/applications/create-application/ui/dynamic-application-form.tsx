import { UseFormReturn } from 'react-hook-form';
import { RegisterHPOForm } from './register-hpo';
import { RegisterCrane } from './register-crane';
import { ApplicationType } from '@/entities/user/applications/model/application.types';

interface Props {
  form: UseFormReturn<any>;
  applicationType: ApplicationType;
}

export const DynamicApplicationForm = ({ applicationType, form }: Props) => {
  switch (applicationType) {
    case ApplicationType.RegisterHPO:
      return <RegisterHPOForm form={form} />;
    case ApplicationType.RegisterCrane:
      return <RegisterCrane form={form} />;
    default:
      return null;
  }
};
