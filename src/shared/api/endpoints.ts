const APPEALS_EQUIPMENT_URL = '/appeals/equipment/'

export const API_ENDPOINTS: Record<string, string> = {
    LOGIN: '/auth/login',
    LOGIN_ONE_ID: '/auth/one-id',
    LOGOUT: '/auth/logout',
    USER_ME: '/users/me',
    USERS: '/users',
    REGIONS: '/regions',
    DISTRICTS: '/districts',
    DEPARTMENTS: '/departments',
    OFFICES: '/offices',
    OFFICE_USERS: '/users/office-users',
    COMMITTEE_USERS: '/users/committee-users',
    HAZARDOUS_FACILITY_TYPES: '/hf-types',
    APPEAL_HF: '/appeals/hf',
    TEMPLATES: '/templates',
    UPDATE_TEMPLATE_CONTENT: '/templates/content',
    CHILD_EQUIPMENTS: '/child-equipments',

    //SELECT_DATA
    REGIONS_SELECT: '/regions/select',
    DISTRICT_SELECT: '/districts/select',
    DEPARTMENT_SELECT: '/departments/select',
    OFFICE_SELECT: '/offices/select',
    HAZARDOUS_FACILITY_TYPES_SELECT: '/hf-types/select',
    CHILD_EQUIPMENTS_SELECT: '/child-equipments/select',

    //APPEALS_EQUIPMENT_URLS
    APPEAL_EQUIPMENT_PIPELINE: APPEALS_EQUIPMENT_URL + 'pipeline',
    APPEAL_EQUIPMENT_LPG_POWERED: APPEALS_EQUIPMENT_URL + 'lpg-powered',
    APPEAL_EQUIPMENT_LPG_CONTAINER: APPEALS_EQUIPMENT_URL + 'lpg-container',
    APPEAL_EQUIPMENT_HOIST: APPEALS_EQUIPMENT_URL + 'hoist',
    APPEAL_EQUIPMENT_HEAT_PIPELINE: APPEALS_EQUIPMENT_URL + 'heat-pipeline',
    APPEAL_EQUIPMENT_ESCALATOR: APPEALS_EQUIPMENT_URL + 'escalator',
    APPEAL_EQUIPMENT_ELEVATOR: APPEALS_EQUIPMENT_URL + 'elevator',
    APPEAL_EQUIPMENT_CRANE: APPEALS_EQUIPMENT_URL + 'crane',
    APPEAL_EQUIPMENT_CONTAINER: APPEALS_EQUIPMENT_URL + 'container',
    APPEAL_EQUIPMENT_CHEMICAL_CONTAINER: APPEALS_EQUIPMENT_URL + 'chemical-container',
    APPEAL_EQUIPMENT_CABLEWAY: APPEALS_EQUIPMENT_URL + 'cableway',
    APPEAL_EQUIPMENT_BOILER: APPEALS_EQUIPMENT_URL + 'boiler',
    APPEAL_EQUIPMENT_BOILER_UTILIZER: APPEALS_EQUIPMENT_URL + 'boiler-utilizer',
};
