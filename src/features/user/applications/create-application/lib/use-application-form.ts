import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ApplicationTypeEnum } from '@/entities/user/applications/create-application/model/application.types';
import {
  ApplicationSchema,
  defaultApplicationValues,
} from '@/entities/user/applications/create-application/model/application.schema';

export function useApplicationForm(applicationType: ApplicationTypeEnum) {
  const schema = ApplicationSchema[applicationType];

  return useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultApplicationValues[applicationType],
  });
}
