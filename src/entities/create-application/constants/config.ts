import { ApplicationTypeEnum } from '../types/enums';

export const applicationConfigs: Record<string, any> = {
  [ApplicationTypeEnum.RegisterHPO]: {
    pdfEndpoint: '/appeals/hf/generate-pdf',
    submitEndpoint: '/appeals/physical/create',
  },
  [ApplicationTypeEnum.RegisterLift]: {
    pdfEndpoint: '/appeals/physical/generate-pdf',
    submitEndpoint: '/appeals/physical/create',
  },
};
