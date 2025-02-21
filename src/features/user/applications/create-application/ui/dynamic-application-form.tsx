import { RegisterHPOForm } from './register-hpo';
import { ApplicationType } from '@/entities/user/applications/model/application.types';
import { UseFormReturn } from 'react-hook-form';

interface Props {
  form: UseFormReturn<any>;
  applicationType: ApplicationType;
}

export const DynamicApplicationForm = ({ applicationType, form }: Props) => {
  switch (applicationType) {
    case ApplicationType.RegisterHPO:
      return <RegisterHPOForm form={form} />;
    default:
      return null;
  }
};
