import { API_ENDPOINTS } from '@/shared/api';
import { ApplicationTypeEnum } from '../types/enums';

export const applicationConfigs: Record<string, any> = {
  [ApplicationTypeEnum.REGISTER_HF]: {
    submitEndpoint: API_ENDPOINTS.APPEAL_HF_CREATE,
    pdfEndpoint: API_ENDPOINTS.APPEAL_HF_PDF_GENERATION,
  },
  [ApplicationTypeEnum.DEREGISTER_HF]: {
    submitEndpoint: API_ENDPOINTS.APPEAL_HF + '/deregister',
    pdfEndpoint: API_ENDPOINTS.APPEAL_HF_PDF_GENERATION.replace('/register', '/deregister'),
  },
  [ApplicationTypeEnum.MODIFY_HF]: {
    submitEndpoint: API_ENDPOINTS.APPEAL_HF + '/modify',
    pdfEndpoint: API_ENDPOINTS.APPEAL_HF_PDF_GENERATION.replace('/register', '/modify'),
  },
  [ApplicationTypeEnum.REGISTER_CRANE]: {
    submitEndpoint: API_ENDPOINTS.APPEAL_EQUIPMENT_CRANE,
    pdfEndpoint: API_ENDPOINTS.APPEAL_EQUIPMENT_PDF_CRANE,
  },
  [ApplicationTypeEnum.REGISTER_CONTAINER]: {
    submitEndpoint: API_ENDPOINTS.APPEAL_EQUIPMENT_CONTAINER,
    pdfEndpoint: API_ENDPOINTS.APPEAL_EQUIPMENT_PDF_CONTAINER,
  },
  [ApplicationTypeEnum.REGISTER_BOILER]: {
    submitEndpoint: API_ENDPOINTS.APPEAL_EQUIPMENT_BOILER,
    pdfEndpoint: API_ENDPOINTS.APPEAL_EQUIPMENT_PDF_BOILER,
  },
  [ApplicationTypeEnum.REGISTER_ELEVATOR]: {
    submitEndpoint: API_ENDPOINTS.APPEAL_EQUIPMENT_ELEVATOR,
    pdfEndpoint: API_ENDPOINTS.APPEAL_EQUIPMENT_PDF_ELEVATOR,
  },
  [ApplicationTypeEnum.REGISTER_ESCALATOR]: {
    submitEndpoint: API_ENDPOINTS.APPEAL_EQUIPMENT_ESCALATOR,
    pdfEndpoint: API_ENDPOINTS.APPEAL_EQUIPMENT_PDF_ESCALATOR,
  },
  [ApplicationTypeEnum.REGISTER_CABLEWAY]: {
    submitEndpoint: API_ENDPOINTS.APPEAL_EQUIPMENT_CABLEWAY,
    pdfEndpoint: API_ENDPOINTS.APPEAL_EQUIPMENT_PDF_CABLEWAY,
  },
  [ApplicationTypeEnum.REGISTER_HOIST]: {
    submitEndpoint: API_ENDPOINTS.APPEAL_EQUIPMENT_HOIST,
    pdfEndpoint: API_ENDPOINTS.APPEAL_EQUIPMENT_PDF_HOIST,
  },
  [ApplicationTypeEnum.REGISTER_PIPELINE]: {
    submitEndpoint: API_ENDPOINTS.APPEAL_EQUIPMENT_PIPELINE,
    pdfEndpoint: API_ENDPOINTS.APPEAL_EQUIPMENT_PDF_PIPELINE,
  },
  [ApplicationTypeEnum.REGISTER_CHEMICAL_CONTAINER]: {
    submitEndpoint: API_ENDPOINTS.APPEAL_EQUIPMENT_CHEMICAL_CONTAINER,
    pdfEndpoint: API_ENDPOINTS.APPEAL_EQUIPMENT_PDF_CHEMICAL_CONTAINER,
  },
  [ApplicationTypeEnum.REGISTER_HEAT_PIPELINE]: {
    submitEndpoint: API_ENDPOINTS.APPEAL_EQUIPMENT_HEAT_PIPELINE,
    pdfEndpoint: API_ENDPOINTS.APPEAL_EQUIPMENT_PDF_HEAT_PIPELINE,
  },
  [ApplicationTypeEnum.REGISTER_BOILER_UTILIZER]: {
    submitEndpoint: API_ENDPOINTS.APPEAL_EQUIPMENT_BOILER_UTILIZER,
    pdfEndpoint: API_ENDPOINTS.APPEAL_EQUIPMENT_PDF_BOILER_UTILIZER,
  },
  [ApplicationTypeEnum.REGISTER_LPG_CONTAINER]: {
    submitEndpoint: API_ENDPOINTS.APPEAL_EQUIPMENT_LPG_CONTAINER,
    pdfEndpoint: API_ENDPOINTS.APPEAL_EQUIPMENT_PDF_LPG_CONTAINER,
  },
  [ApplicationTypeEnum.REGISTER_LPG_POWERED]: {
    submitEndpoint: API_ENDPOINTS.APPEAL_EQUIPMENT_LPG_POWERED,
    pdfEndpoint: API_ENDPOINTS.APPEAL_EQUIPMENT_PDF_LPG_POWERED,
  },
  [ApplicationTypeEnum.REGISTER_ATTRACTION_PASSPORT]: {
    submitEndpoint: API_ENDPOINTS.APPEALS_EQUIPMENT_URL + 'attraction-passport',
    pdfEndpoint: API_ENDPOINTS.APPEALS_EQUIPMENT_GENERATE_PDF_URL + 'attraction-passport',
  },
  [ApplicationTypeEnum.REGISTER_ATTRACTION]: {
    submitEndpoint: API_ENDPOINTS.APPEALS_EQUIPMENT_URL + 'attraction',
    pdfEndpoint: API_ENDPOINTS.APPEALS_EQUIPMENT_GENERATE_PDF_URL + 'attraction',
  },
  [ApplicationTypeEnum.REGISTER_IRS]: {
    submitEndpoint: '/appeals/irs/register',
    pdfEndpoint: '/appeals/irs/generate-pdf/register',
  },
  [ApplicationTypeEnum.ACCEPT_IRS]: {
    submitEndpoint: '/appeals/irs/accept',
    pdfEndpoint: '/appeals/irs/generate-pdf/accept',
  },
  [ApplicationTypeEnum.TRANSFER_IRS]: {
    submitEndpoint: '/appeals/irs/transfer',
    pdfEndpoint: '/appeals/irs/generate-pdf/transfer',
  },
};
