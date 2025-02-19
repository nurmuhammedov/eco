import { RegisterHPOForm } from './register-hpo/register-hpo-ui';
import { ApplicationType } from '@/entities/user/applications/model/application.types';

interface Props {
  applicationType: ApplicationType;
}

export const DynamicApplicationForm = ({ applicationType }: Props) => {
  switch (applicationType) {
    case ApplicationType.RegisterHPO:
      return <RegisterHPOForm />;
    default:
      return null;
  }
};
