export enum MainApplicationCategory {
  REGISTER = 'REGISTER',
  UNREGISTER = 'UNREGISTER',
  REREGISTER = 'REREGISTER',
}

export enum ApplicationCategory {
  INM = 'INM',
  HOKQ = 'HOKQ',
  XICHO = 'XICHO',
  CADASTRE = 'CADASTRE',
  ACCREDITATION = 'ACCREDITATION',
  ATTESTATION_PREVENTION = 'ATTESTATION_PREVENTION',
  DEFAULT = 'DEFAULT',
}

export enum BuildingSphereType {
  RESIDENTIAL = 'RESIDENTIAL', // Turar joy binosi
  HOTEL = 'HOTEL', // Mehmonxona
  SOCIAL = 'SOCIAL', // Ijtimoiy soha
  INDUSTRIAL = 'INDUSTRIAL', // Sanoat korxonasi
  SERVICE = 'SERVICE', // Xizmat ko‘rsatish objekti
  OTHER = 'OTHER', // Boshqa objektlar
}

export enum ApplicationTypeEnum {
  // Xavfli Ishlab Chiqarish Obyektini ro‘yxatga olish, o'zgartirish va chiqarish
  REGISTER_HF = 'REGISTER_HF',
  DEREGISTER_HF = 'DEREGISTER_HF',
  MODIFY_HF = 'MODIFY_HF',

  DEREGISTER_EQUIPMENT = 'DEREGISTER_CRANE',

  //Crane
  CRANE = 'CRANE',
  REGISTER_CRANE = 'REGISTER_CRANE',

  //Container - bosim ostida ishlovchi idish
  CONTAINER = 'CONTAINER',
  REGISTER_CONTAINER = 'REGISTER_CONTAINER',

  //Boiler - bug'qozon
  BOILER = 'BOILER',
  REGISTER_BOILER = 'REGISTER_BOILER',

  //Elevator - lift
  ELEVATOR = 'ELEVATOR',
  REGISTER_ELEVATOR = 'REGISTER_ELEVATOR',

  //Escalator
  ESCALATOR = 'ESCALATOR',
  REGISTER_ESCALATOR = 'REGISTER_ESCALATOR',

  //Cableway - osma qarqonli yuruvchi yo'l
  CABLEWAY = 'CABLEWAY',
  REGISTER_CABLEWAY = 'REGISTER_CABLEWAY',

  //hoist - yuk ko'targich
  HOIST = 'HOIST',
  REGISTER_HOIST = 'REGISTER_HOIST',

  //pipeline - quvur
  PIPELINE = 'PIPELINE',
  REGISTER_PIPELINE = 'REGISTER_PIPELINE',

  //Chemical container - bosim ostida ishlovchi idish (kimyoviy)
  CHEMICAL_CONTAINER = 'CHEMICAL_CONTAINER',
  REGISTER_CHEMICAL_CONTAINER = 'REGISTER_CHEMICAL_CONTAINER',

  //Heat pipe - bug' va issiqsuv quvuri
  HEAT_PIPELINE = 'HEAT_PIPELINE',
  REGISTER_HEAT_PIPELINE = 'REGISTER_HEAT_PIPELINE',

  //Boiler utilizer - qozon utilizator
  BOILER_UTILIZER = 'BOILER_UTILIZER',
  REGISTER_BOILER_UTILIZER = 'REGISTER_BOILER_UTILIZER',

  //LPG container (Liquefied Petroleum Gas) - bosim ostida ishlovchi idish (SUG)
  LPG_CONTAINER = 'LPG_CONTAINER',
  REGISTER_LPG_CONTAINER = 'REGISTER_LPG_CONTAINER',

  //LPG powered (Liquefied Petroleum Gas) - SUG bilan ishlovchi qurilmalar
  LPG_POWERED = 'LPG_POWERED',
  REGISTER_LPG_POWERED = 'REGISTER_LPG_POWERED',

  //attraction_passport - Attraksion pasporti
  ATTRACTION_PASSPORT = 'ATTRACTION_PASSPORT',
  REGISTER_ATTRACTION_PASSPORT = 'REGISTER_ATTRACTION_PASSPORT',

  //attraction - Attraksion
  ATTRACTION = 'ATTRACTION',
  REGISTER_ATTRACTION = 'REGISTER_ATTRACTION',

  // ACCREDITATION
  REGISTER_ACCREDITATION = 'ACCREDIT_EXPERT_ORGANIZATION',
  RE_REGISTER_ACCREDITATION = 'RE_ACCREDIT_EXPERT_ORGANIZATION',
  EXPAND_ACCREDITATION = 'EXPEND_ACCREDITATION_SCOPE',
  REGISTER_EXPERTISE_CONCLUSION = 'REGISTER_EXPERTISE_CONCLUSION',

  // CADASTRE
  REGISTER_CADASTRE_PASSPORT = 'REGISTER_CADASTRE_PASSPORT',
  REGISTER_DECLARATION = 'REGISTER_DECLARATION',

  // ATTESTATION,
  REGISTER_ATTESTATION = 'REGISTER_ATTESTATION',
  ATTESTATION_COMMITTEE = 'ATTESTATION_COMMITTEE',
  ATTESTATION_REGIONAL = 'ATTESTATION_REGIONAL',

  DEFAULT = 'DEFAULT',

  //IRS (Ionizing Radiation Source ) - INM ro'yhatga olish, qabul qilib olish va berish
  IRS = 'IRS',
  REGISTER_IRS = 'REGISTER_IRS',
  ACCEPT_IRS = 'ACCEPT_IRS',
  TRANSFER_IRS = 'TRANSFER_IRS',
}

export enum IrsIdentifierType {
  SRM = 'SRM',
  NUM = 'NUM',
}

export enum IrsCategory {
  I = 'I',
  II = 'II',
  III = 'III',
  IV = 'IV',
  V = 'V',
}

export enum IrsUsageType {
  USAGE = 'USAGE', // Ishlatish (foydalanish) uchun
  DISPOSAL = 'DISPOSAL', // Ko‘mish uchun
  EXPORT = 'EXPORT', // Chet-elga olib chiqish uchun
  STORAGE = 'STORAGE', // Vaqtinchalik saqlash uchun
}
