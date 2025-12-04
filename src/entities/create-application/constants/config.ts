import { API_ENDPOINTS } from '@/shared/api'
import { ApplicationTypeEnum } from '../types/enums'

export const applicationConfigs: Record<string, any> = {
  [ApplicationTypeEnum.REGISTER_HF]: {
    submitEndpoint: API_ENDPOINTS.APPEAL_HF_CREATE,
    pdfEndpoint: API_ENDPOINTS.APPEAL_HF_PDF_GENERATION,
  },
  [ApplicationTypeEnum.DEREGISTER_HF]: {
    submitEndpoint: '/appeals/hf/deregister',
    pdfEndpoint: '/appeals/hf/deregister/generate-pdf',
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
    submitEndpoint: API_ENDPOINTS.APPEAL_ATTRACTION_PASSPORT,
    pdfEndpoint: API_ENDPOINTS.APPEAL_EQUIPMENT_PDF_ATTRACTION_PASSPORT,
  },
  [ApplicationTypeEnum.REGISTER_ATTESTATION]: {
    submitEndpoint: API_ENDPOINTS.APPEALS_ATTESTATION,
    pdfEndpoint: API_ENDPOINTS.APPEALS_ATTESTATION_GENERATE_PDF,
  },
  [ApplicationTypeEnum.REGISTER_ATTRACTION]: {
    submitEndpoint: API_ENDPOINTS.APPEAL_ATTRACTION,
    pdfEndpoint: API_ENDPOINTS.APPEAL_EQUIPMENT_PDF_ATTRACTION,
  },
  [ApplicationTypeEnum.REGISTER_IRS]: {
    submitEndpoint: '/appeals/irs',
    pdfEndpoint: '/appeals/irs/generate-pdf',
  },
  [ApplicationTypeEnum.ACCEPT_IRS]: {
    submitEndpoint: '/appeals/irs/acceptance',
    pdfEndpoint: '/appeals/irs/generate-pdf',
  },
  [ApplicationTypeEnum.TRANSFER_IRS]: {
    submitEndpoint: '/appeals/irs/transfer',
    pdfEndpoint: '/appeals/irs/generate-pdf',
  },
  [ApplicationTypeEnum.REGISTER_XRAY]: {
    submitEndpoint: '/appeals/xray',
    pdfEndpoint: '/appeals/xray/generate-pdf',
  },
  [ApplicationTypeEnum.ILLEGAL_REGISTER_XRAY]: {
    submitEndpoint: '/appeals/xray/unofficial',
    pdfEndpoint: '/appeals/xray/unofficial/generate-pdf',
  },
  [ApplicationTypeEnum.REGISTER_ACCREDITATION]: {
    submitEndpoint: API_ENDPOINTS.APPEALS_ACCREDITATION,
    pdfEndpoint: API_ENDPOINTS.APPEALS_ACCREDITATION_GENERATE_PDF,
  },
  [ApplicationTypeEnum.RE_REGISTER_ACCREDITATION]: {
    submitEndpoint: API_ENDPOINTS.APPEALS_RE_ACCREDITATION,
    pdfEndpoint: API_ENDPOINTS.APPEALS_RE_ACCREDITATION_GENERATE_PDF,
  },
  [ApplicationTypeEnum.EXPAND_ACCREDITATION]: {
    submitEndpoint: API_ENDPOINTS.APPEALS_EXPEND_ACCREDITATION,
    pdfEndpoint: API_ENDPOINTS.APPEALS_EXPEND_ACCREDITATION_GENERATE_PDF,
  },
  [ApplicationTypeEnum.REGISTER_EXPERTISE_CONCLUSION]: {
    submitEndpoint: API_ENDPOINTS.APPEALS_ACCREDITATION_CONCLUSION,
    pdfEndpoint: API_ENDPOINTS.APPEALS_ACCREDITATION_CONCLUSION_GENERATE_PDF,
  },
  [ApplicationTypeEnum.REGISTER_CADASTRE_PASSPORT]: {
    submitEndpoint: API_ENDPOINTS.APPEALS_CADASTRE_PASSPORT,
    pdfEndpoint: API_ENDPOINTS.APPEALS_CADASTRE_PASSPORT_GENERATE_PDF,
  },
  [ApplicationTypeEnum.REGISTER_DECLARATION]: {
    submitEndpoint: API_ENDPOINTS.APPEALS_REGISTER_DECLARATION,
    pdfEndpoint: API_ENDPOINTS.APPEALS_REGISTER_DECLARATION_GENERATE_PDF,
  },
  [ApplicationTypeEnum.DEREGISTER_EQUIPMENT]: {
    submitEndpoint: '/appeals/equipment/deregister',
    pdfEndpoint: '/appeals/equipment/deregister-pdf',
  },
  [ApplicationTypeEnum.RE_REGISTER_EQUIPMENT]: {
    submitEndpoint: '/appeals/equipment/reregister',
    pdfEndpoint: '/appeals/equipment/reregister-pdf',
  },
  [ApplicationTypeEnum.ILLEGAL_REGISTER_HF]: {
    submitEndpoint: '/appeals/hf/unofficial',
    pdfEndpoint: '/appeals/hf/unofficial/generate-pdf',
  },
  [ApplicationTypeEnum.ILLEGAL_REGISTER_CRANE]: {
    submitEndpoint: '/appeals/equipment/unofficial/crane',
    pdfEndpoint: '/appeals/equipment/unofficial/generate-pdf/crane',
  },
  [ApplicationTypeEnum.ILLEGAL_REGISTER_CONTAINER]: {
    submitEndpoint: '/appeals/equipment/unofficial/container',
    pdfEndpoint: '/appeals/equipment/unofficial/generate-pdf/container',
  },
  [ApplicationTypeEnum.ILLEGAL_REGISTER_BOILER]: {
    submitEndpoint: '/appeals/equipment/unofficial/boiler',
    pdfEndpoint: '/appeals/equipment/unofficial/generate-pdf/boiler',
  },
  [ApplicationTypeEnum.ILLEGAL_REGISTER_ELEVATOR]: {
    submitEndpoint: '/appeals/equipment/unofficial/elevator',
    pdfEndpoint: '/appeals/equipment/unofficial/generate-pdf/elevator',
  },
  [ApplicationTypeEnum.ILLEGAL_REGISTER_ESCALATOR]: {
    submitEndpoint: '/appeals/equipment/unofficial/escalator',
    pdfEndpoint: '/appeals/equipment/unofficial/generate-pdf/escalator',
  },
  [ApplicationTypeEnum.ILLEGAL_REGISTER_ATTRACTION_PASSPORT]: {
    submitEndpoint: '/appeals/equipment/unofficial/attraction',
    pdfEndpoint: '/appeals/equipment/unofficial/generate-pdf/attraction',
  },
  [ApplicationTypeEnum.ILLEGAL_REGISTER_PIPELINE]: {
    submitEndpoint: '/appeals/equipment/unofficial/pipeline',
    pdfEndpoint: '/appeals/equipment/unofficial/generate-pdf/pipeline',
  },
  [ApplicationTypeEnum.ILLEGAL_REGISTER_CHEMICAL_CONTAINER]: {
    submitEndpoint: '/appeals/equipment/unofficial/chemical-container',
    pdfEndpoint: '/appeals/equipment/unofficial/generate-pdf/chemical-container',
  },
  [ApplicationTypeEnum.ILLEGAL_REGISTER_HEAT_PIPELINE]: {
    submitEndpoint: '/appeals/equipment/unofficial/heat-pipeline',
    pdfEndpoint: '/appeals/equipment/unofficial/generate-pdf/heat-pipeline',
  },
  [ApplicationTypeEnum.ILLEGAL_REGISTER_BOILER_UTILIZER]: {
    submitEndpoint: '/appeals/equipment/unofficial/boiler-utilizer',
    pdfEndpoint: '/appeals/equipment/unofficial/generate-pdf/boiler-utilizer',
  },
  [ApplicationTypeEnum.ILLEGAL_REGISTER_LPG_CONTAINER]: {
    submitEndpoint: '/appeals/equipment/unofficial/lpg-container',
    pdfEndpoint: '/appeals/equipment/unofficial/generate-pdf/lpg-container',
  },
  [ApplicationTypeEnum.ILLEGAL_REGISTER_LPG_POWERED]: {
    submitEndpoint: '/appeals/equipment/unofficial/lpg-powered',
    pdfEndpoint: '/appeals/equipment/unofficial/generate-pdf/lpg-powered',
  },
  [ApplicationTypeEnum.ILLEGAL_REGISTER_HOIST]: {
    submitEndpoint: '/appeals/equipment/unofficial/hoist',
    pdfEndpoint: '/appeals/equipment/unofficial/generate-pdf/hoist',
  },
  [ApplicationTypeEnum.ILLEGAL_REGISTER_CABLEWAY]: {
    submitEndpoint: '/appeals/equipment/unofficial/cableway',
    pdfEndpoint: '/appeals/equipment/unofficial/generate-pdf/cableway',
  },
}
