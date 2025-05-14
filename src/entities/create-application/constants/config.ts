import { API_ENDPOINTS } from '@/shared/api';
import { ApplicationTypeEnum } from '../types/enums';

export const applicationConfigs: Record<string, any> = {
  [ApplicationTypeEnum.RegisterHPO]: {
    submitEndpoint: API_ENDPOINTS.APPEAL_HF_CREATE,
    pdfEndpoint: API_ENDPOINTS.APPEAL_HF_PDF_GENERATION,
  },
  [ApplicationTypeEnum.RegisterLift]: {
    pdfEndpoint: '/appeals/physical/generate-pdf',
    submitEndpoint: '/appeals/physical/create',
  },
};
