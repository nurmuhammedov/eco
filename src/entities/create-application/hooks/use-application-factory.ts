import { useCallback } from 'react';
import { applicationConfigs, ApplicationTypeEnum } from '@/entities/create-application';
import {
  useApplicationCreation,
  UseApplicationCreationProps,
} from '@/features/create-application/model/use-application-creation';

interface UseApplicationFactoryProps extends Omit<UseApplicationCreationProps, 'pdfEndpoint' | 'submitEndpoint'> {
  applicationType: ApplicationTypeEnum;
}

export function useApplicationFactory({ applicationType, onSuccess, onError }: UseApplicationFactoryProps) {
  const getApplicationConfig = useCallback((): any => {
    const config = applicationConfigs[applicationType];

    if (!config) {
      return {
        pdfEndpoint: '/appeals/hf/generate-pdf',
        submitEndpoint: '/create-application',
      };
    }

    return config;
  }, [applicationType]);

  const config = getApplicationConfig();

  const applicationCreation = useApplicationCreation({
    onError,
    onSuccess,
    pdfEndpoint: config.pdfEndpoint,
    submitEndpoint: config.submitEndpoint,
  });

  return {
    ...applicationCreation,
    config,
  };
}
