import { Suspense, useMemo } from 'react';
import { loadComponent } from '../lib/load-component';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import { SkeletonFormLoader } from '@/entities/user/applications/create-application/ui/skeleton-loader';
import { ApplicationTypeEnum } from '@/entities/user/applications/create-application/model/application.types';

interface Props<TFormValues extends FieldValues> {
  form: UseFormReturn<TFormValues>;
  applicationType: ApplicationTypeEnum;
}

export const DynamicApplicationForm = <TFormValues extends FieldValues>({
  form,
  applicationType,
}: Props<TFormValues>) => {
  const Component = useMemo(
    () => loadComponent(applicationType),
    [applicationType],
  );

  return (
    <Suspense fallback={<SkeletonFormLoader />}>
      <Component form={form} />
    </Suspense>
  );
};
