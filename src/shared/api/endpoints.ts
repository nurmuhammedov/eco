const APPEALS_EQUIPMENT_URL = '/appeals/equipment/'
const APPEALS_EQUIPMENT_GENERATE_PDF_URL = '/appeals/equipment/generate-pdf/'

export const API_ENDPOINTS: Record<string, string> = {
  LOGIN: '/auth/login',
  LOGIN_ONE_ID: '/auth/one-id',
  LOGOUT: '/auth/logout',
  USER_ME: '/users/me',
  USERS: '/users',
  USER_DELEGATION_ME: '/user-delegation/me',
  SWITCH_OTHER: '/auth/switch-other',
  SWITCH_BACK: '/auth/switch-back',
  REGIONS: '/regions',
  DISTRICTS: '/districts',
  PARKS: '/parks',
  INSPECTION_CATEGORY_TYPES: '/checklists/categories',
  INSPECTION_CHECKLISTS: '/checklists',
  DEPARTMENTS: '/departments',
  OFFICES: '/offices',
  OFFICE_USERS: '/users/office-users',
  COMMITTEE_USERS: '/users/committee-users',
  HAZARDOUS_FACILITY_TYPES: '/hf-types',
  HAZARDOUS_FACILITY_CATEGORIES: '/hf-categories',
  APPEAL_HF: '/appeals/hf',
  TEMPLATES: '/templates',
  UPDATE_TEMPLATE_CONTENT: '/templates/content',
  CHILD_EQUIPMENTS: '/child-equipments',
  GET_FILE_BY_PATH: '/attachments/file',

  //SELECT_DATA
  REGIONS_SELECT: '/regions/select',
  DISTRICT_SELECT: '/districts/select',
  PARKS_SELECT: '/parks/select',
  DEPARTMENT_SELECT: '/departments/select',
  OFFICE_SELECT: '/offices/select',
  HAZARDOUS_FACILITY_SELECT: '/hf/select',
  EMPLOYEES_SELECT: '/employee/select/by-hf/',
  HF_SELECT: '/hf/select',
  HAZARDOUS_FACILITY_TYPES_SELECT: '/hf-types/select',
  HAZARDOUS_FACILITY_CATEGORIES_SELECT: '/hf-categories/select',
  CHILD_EQUIPMENTS_SELECT: '/child-equipments/select',

  APPEALS_ATTESTATION: '/appeals/attestation',
  APPEALS_ATTESTATION_GENERATE_PDF: '/appeals/attestation/generate-pdf',

  // APPEALS CREATE (SUBMIT)
  APPEAL_HF_CREATE: '/appeals/hf',
  APPEAL_EQUIPMENT_PIPELINE: APPEALS_EQUIPMENT_URL + 'pipeline',
  APPEAL_EQUIPMENT_LPG_POWERED: APPEALS_EQUIPMENT_URL + 'lpg-powered',
  APPEAL_EQUIPMENT_LPG_CONTAINER: APPEALS_EQUIPMENT_URL + 'lpg-container',
  APPEAL_EQUIPMENT_HOIST: APPEALS_EQUIPMENT_URL + 'hoist',
  APPEAL_EQUIPMENT_HEAT_PIPELINE: APPEALS_EQUIPMENT_URL + 'heat-pipeline',
  APPEAL_EQUIPMENT_ESCALATOR: APPEALS_EQUIPMENT_URL + 'escalator',
  APPEAL_EQUIPMENT_CRANE: APPEALS_EQUIPMENT_URL + 'crane',
  APPEAL_EQUIPMENT_CONTAINER: APPEALS_EQUIPMENT_URL + 'container',
  APPEAL_EQUIPMENT_CHEMICAL_CONTAINER: APPEALS_EQUIPMENT_URL + 'chemical-container',
  APPEAL_EQUIPMENT_CABLEWAY: APPEALS_EQUIPMENT_URL + 'cableway',
  APPEAL_EQUIPMENT_BOILER: APPEALS_EQUIPMENT_URL + 'boiler',
  APPEAL_EQUIPMENT_BOILER_UTILIZER: APPEALS_EQUIPMENT_URL + 'boiler-utilizer',
  APPEAL_ATTRACTION_PASSPORT: APPEALS_EQUIPMENT_URL + 'attraction-passport',
  APPEAL_ATTRACTION: APPEALS_EQUIPMENT_URL + 'attraction',
  APPEAL_EQUIPMENT_OIL_CONTAINER: APPEALS_EQUIPMENT_URL + 'oil-container',
  APPEAL_EQUIPMENT_UNOFFICIAL_OIL_CONTAINER: '/appeals/equipment/unofficial/oil-container',
  APPEAL_EQUIPMENT_TANKER: APPEALS_EQUIPMENT_URL + 'tanker',
  APPEAL_EQUIPMENT_UNOFFICIAL_TANKER: '/appeals/equipment/unofficial/tanker',

  // APPEALS PDF GENERATION
  APPEAL_HF_PDF_GENERATION: '/appeals/hf/generate-pdf',
  APPEAL_EQUIPMENT_PDF_PIPELINE: APPEALS_EQUIPMENT_GENERATE_PDF_URL + 'pipeline',
  APPEAL_EQUIPMENT_PDF_LPG_POWERED: APPEALS_EQUIPMENT_GENERATE_PDF_URL + 'lpg-powered',
  APPEAL_EQUIPMENT_PDF_LPG_CONTAINER: APPEALS_EQUIPMENT_GENERATE_PDF_URL + 'lpg-container',
  APPEAL_EQUIPMENT_PDF_HOIST: APPEALS_EQUIPMENT_GENERATE_PDF_URL + 'hoist',
  APPEAL_EQUIPMENT_PDF_HEAT_PIPELINE: APPEALS_EQUIPMENT_GENERATE_PDF_URL + 'heat-pipeline',
  APPEAL_EQUIPMENT_PDF_ESCALATOR: APPEALS_EQUIPMENT_GENERATE_PDF_URL + 'escalator',
  APPEAL_EQUIPMENT_PDF_CRANE: APPEALS_EQUIPMENT_GENERATE_PDF_URL + 'crane',
  APPEAL_EQUIPMENT_PDF_CONTAINER: APPEALS_EQUIPMENT_GENERATE_PDF_URL + 'container',
  APPEAL_EQUIPMENT_PDF_CHEMICAL_CONTAINER: APPEALS_EQUIPMENT_GENERATE_PDF_URL + 'chemical-container',
  APPEAL_EQUIPMENT_PDF_CABLEWAY: APPEALS_EQUIPMENT_GENERATE_PDF_URL + 'cableway',
  APPEAL_EQUIPMENT_PDF_BOILER: APPEALS_EQUIPMENT_GENERATE_PDF_URL + 'boiler',
  APPEAL_EQUIPMENT_PDF_BOILER_UTILIZER: APPEALS_EQUIPMENT_GENERATE_PDF_URL + 'boiler-utilizer',
  APPEAL_EQUIPMENT_PDF_ATTRACTION_PASSPORT: APPEALS_EQUIPMENT_GENERATE_PDF_URL + 'attraction-passport',
  APPEAL_EQUIPMENT_PDF_ATTRACTION: APPEALS_EQUIPMENT_GENERATE_PDF_URL + 'attraction',
  APPEAL_EQUIPMENT_PDF_OIL_CONTAINER: APPEALS_EQUIPMENT_GENERATE_PDF_URL + 'oil-container',
  APPEAL_EQUIPMENT_PDF_UNOFFICIAL_OIL_CONTAINER: '/appeals/equipment/unofficial/generate-pdf/oil-container',
  APPEAL_EQUIPMENT_PDF_TANKER: APPEALS_EQUIPMENT_GENERATE_PDF_URL + 'tanker',
  APPEAL_EQUIPMENT_PDF_UNOFFICIAL_TANKER: '/appeals/equipment/unofficial/generate-pdf/tanker',

  RISK_ASSESSMENT_HF: '/risk-analyses',
  RISK_ASSESSMENT_IRS: '/irs/risk-assessment',
  RISK_ASSESSMENT_ATTRACTIONS: '/equipments/attractions/risk-assessment',
  RISK_ASSESSMENT_ELEVATORS: '/equipments/elevators/risk-assessment',

  CHECKLIST_TEMPLATES: '/attachments/checklist-templates',

  PREVENTIONS: '/preventions',
  INSPECTIONS: '/inspections',

  APPEALS_ACCREDITATION: '/appeals/accreditation',
  APPEALS_ACCREDITATION_GENERATE_PDF: '/appeals/accreditation/generate-pdf',
  APPEALS_ACCREDITATION_CONCLUSION: '/appeals/accreditation/conclusion',
  APPEALS_ACCREDITATION_CONCLUSION_GENERATE_PDF: '/appeals/accreditation/conclusion/generate-pdf',

  APPEALS_REGISTER_DECLARATION: '/appeals/declaration',
  APPEALS_REGISTER_DECLARATION_GENERATE_PDF: '/appeals/declaration/generate-pdf',

  ATTESTATION: '/attestation',
  REPORTS_USER_LOGIN: '/reports/user-login',
  PROFILES_LEGALS: '/profiles/legals',
  PROFILES_INFO: '/profiles/info',
}

/** PDF documents the services API renders for a request and for an exam */
type RequestDocument = 'decision' | 'decision-letter'
type CalendarDocument = 'notice' | 'protocol' | 'protocol-letter'

export const SERVICES_API_ENDPOINTS = {
  // Questions (Savollar)
  QUESTIONS: '/attestation/questions',
  QUESTION_BY_ID: (id: string) => `/attestation/questions/${id}`,
  // Calendars (Imtihonlar) — navbatdagi arizalardan tuziladi
  CALENDARS: '/attestation/calendars',
  CALENDAR_BY_ID: (id: string) => `/attestation/calendars/${id}`,
  CALENDAR_APPLICANTS: (id: string) => `/attestation/calendars/${id}/applicants`,
  CALENDAR_APPLICATIONS: (id: string) => `/attestation/calendars/${id}/applications`,
  CALENDAR_APPLICATION: (id: string, applicationId: string) =>
    `/attestation/calendars/${id}/applications/${applicationId}`,
  CALENDAR_VIDEO: (id: string) => `/attestation/calendars/${id}/video`,
  CALENDAR_DOCUMENT: (id: string, type: CalendarDocument) => `/attestation/calendars/${id}/documents/${type}`,
  MY_CALENDAR_DOCUMENT: (id: string, type: CalendarDocument) => `/attestation/my-calendars/${id}/documents/${type}`,
  // Requests (Arizalar): one organization, one direction, one employee type
  REQUESTS: '/attestation/requests',
  MY_REQUESTS: '/attestation/my-requests',
  REQUEST_BY_ID: (id: string) => `/attestation/requests/${id}`,
  REQUEST_ACCEPT: (id: string) => `/attestation/requests/${id}/accept`,
  REQUEST_REJECT: (id: string) => `/attestation/requests/${id}/reject`,
  REQUEST_DOCUMENT: (id: string, type: RequestDocument) => `/attestation/requests/${id}/documents/${type}`,
  MY_REQUEST_DOCUMENT: (id: string, type: RequestDocument) => `/attestation/my-requests/${id}/documents/${type}`,
  // Commission (Attestatsiya komissiyasi)
  COMMISSION: '/attestation/commission',
  COMMISSION_MEMBERS: '/attestation/commission/members',
  COMMISSION_MEMBER: (id: string) => `/attestation/commission/members/${id}`,
  // Applications (bitta xodim)
  APPLICATIONS: '/attestation/applications',
  EMPLOYEES: '/attestation/employees',
  APPLICATION_BY_ID: (id: string) => `/attestation/applications/${id}`,
  APPLICATION_RESULT: (id: string) => `/attestation/applications/${id}/result`,
  APPLICATION_CERTIFICATE: (id: string) => `/attestation/applications/${id}/certificate`,
  MY_APPLICATION_CERTIFICATE: (id: string) => `/attestation/my-applications/${id}/certificate`,
  // Exams (Imtihon savollari)
  EXAM_GENERATE: (applicationId: string) => `/attestation/exams/generate/${applicationId}`,
  EXAM_BY_APPLICATION: (applicationId: string) => `/attestation/exams/${applicationId}`,
}
