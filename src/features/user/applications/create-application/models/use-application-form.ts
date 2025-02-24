import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ApplicationType } from '@/entities/user/applications/model/application.types';
import {
  ApplicationSchema,
  defaultApplicationValues,
} from '@/entities/user/applications/model/application.schema';

export function useApplicationForm(applicationType: ApplicationType) {
  const schema = ApplicationSchema[applicationType];

  return useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultApplicationValues[applicationType],
  });
}
