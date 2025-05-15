import { applicationConfigs, ApplicationTypeEnum } from '@/entities/create-application';
import { useApplicationCreation, UseApplicationCreationProps } from '@/features/create-application/model';

interface UseApplicationFactoryProps extends Omit<UseApplicationCreationProps, 'pdfEndpoint' | 'submitEndpoint'> {
  applicationType: ApplicationTypeEnum;
}

export function useApplicationFactory({ applicationType, onError }: UseApplicationFactoryProps) {
  const config = applicationConfigs[applicationType];

  const applicationCreation = useApplicationCreation({
    onError,
    pdfEndpoint: config.pdfEndpoint,
    submitEndpoint: config.submitEndpoint,
  });

  return { ...applicationCreation, config };
}
