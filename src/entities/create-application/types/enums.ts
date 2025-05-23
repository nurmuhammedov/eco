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
}

export enum ApplicationTypeEnum {
  // Xavfli Ishlab Chiqarish Obyektini ro‘yxatga olish va chiqarish
  RegisterHPO = 'REGISTER_HPO', // Xavfli ishlab chiqarish obyektini ro‘yxatdan o‘tkazish
  DeregisterHPO = 'DEREGISTER_HPO', // Xavfli ishlab chiqarish obyektini ro‘yxatdan chiqarish

  // Xavfli ishlab chiqarish qurilmalarini ro‘yxatdan o‘tkazish
  RegisterCrane = 'REGISTER_CRANE', // Kranni ro‘yxatga olish
  RegisterVessel = 'REGISTER_VESSEL', // Bosim ostida ishlovchi idishni ro‘yxatga olish
  RegisterBoiler = 'REGISTER_BOILER', // Qozonni ro‘yxatga olish
  RegisterLift = 'REGISTER_LIFT', // Liftni ro‘yxatga olish
  RegisterEscalator = 'REGISTER_ESCALATOR', // Eskalatorni ro‘yxatga olish
  RegisterBridgeOrRoad = 'REGISTER_BRIDGE_OR_ROAD', // Osma arqonli yuruvchi yo'lni ro‘yxatga olish
  RegisterElevator = 'REGISTER_ELEVATOR', // Yuk ko'targichni ro‘yxatga olish
  RegisterPipeline = 'REGISTER_PIPELINE', // Quvurni ro‘yxatga olish
  RegisterAttractionPassport = 'REGISTER_ATTRACTION_PASSPORT', // Attraksion pasportini ro‘yxatga olish
  RegisterAttraction = 'REGISTER_ATTRACTION', // Attraksionni ro‘yxatga olish
  RegisterPressureVesselChemical = 'REGISTER_PRESSURE_VESSEL_CHEMICAL', // Bosim ostida ishlovchi idishlarni (kimyo) ro‘yxatga olish
  RegisterSteamAndHotWaterPipeline = 'REGISTER_STEAM_AND_HOT_WATER_PIPELINE', // Bug‘ va issiq suv quvurlarini ro‘yxatga olish
  RegisterBoilerUtilizer = 'REGISTER_BOILER_UTILIZER', // Qozon utilizatorlarini ro‘yxatga olish
  RegisterPressureVesselLPG = 'REGISTER_PRESSURE_VESSEL_LPG', // Bosim ostida ishlovchi idishlarni (SUG) ro‘yxatga olish
  RegisterHighGasUsageEquipment = 'REGISTER_HIGH_GAS_USAGE_EQUIPMENT', // Yiliga 100 ming va undan ortiq kubometr tabiiy gazdan foydalanuvchi qurilmalarni ro‘yxatga olish

  // Xavfli ishlab chiqarish qurilmalarini ro‘yxatdan chiqarish
  DeregisterCrane = 'DEREGISTER_CRANE', // Kranni ro‘yxatdan chiqarish
  DeregisterVessel = 'DEREGISTER_VESSEL', // Bosim ostida ishlovchi idishni ro‘yxatdan chiqarish
  DeregisterBoiler = 'DEREGISTER_BOILER', // Qozonni ro‘yxatdan chiqarish
  DeregisterLift = 'DEREGISTER_LIFT', // Liftni ro‘yxatdan chiqarish
  DeregisterEscalator = 'DEREGISTER_ESCALATOR', // Eskalatorni ro‘yxatdan chiqarish
  DeregisterBridgeOrRoad = 'DEREGISTER_BRIDGE_OR_ROAD', // Osma arqonli yuruvchi yo'lni ro‘yxatdan chiqarish
  DeregisterElevator = 'DEREGISTER_ELEVATOR', // Yuk ko'targichni ro‘yxatdan chiqarish
  DeregisterPipeline = 'DEREGISTER_PIPELINE', // Quvurni ro‘yxatdan chiqarish
  DeregisterAttractionPassport = 'DEREGISTER_ATTRACTION_PASSPORT', // Attraksion pasportini ro‘yxatdan chiqarish
  DeregisterAttraction = 'DEREGISTER_ATTRACTION', // Attraksionni ro‘yxatdan chiqarish

  // Xavfli ishlab chiqarish obyektlari xodimlarini attestatsiyadan o‘tkazish
  CertifyHPOEmployee = 'CERTIFY_HPO_EMPLOYEE', // Xavfli ishlab chiqarish obyektlari xodimlarini attestatsiyadan o‘tkazish

  // Ekspert tashkilotini akkreditatsiya qilish
  AccreditExpertOrganization = 'ACCREDIT_EXPERT_ORGANIZATION', // Ekspert tashkilotini akkreditatsiya qilish
  ReaccreditExpertOrganization = 'REACCREDIT_EXPERT_ORGANIZATION', // Ekspert tashkilotini qayta akkreditatsiya qilish
  ExpandAccreditationScope = 'EXPAND_ACCREDITATION_SCOPE', // Ekspert tashkilotining akkreditatsiya sohasini kengaytirish

  // Sanoat xavfsizligi bo‘yicha ekspertiza xulosalari
  RegisterSafetyExpertConclusion = 'REGISTER_SAFETY_EXPERT_CONCLUSION', // Sanoat xavfsizligi ekspertiza xulosalarini ro‘yxatga olish
  DeregisterSafetyExpertConclusion = 'DEREGISTER_SAFETY_EXPERT_CONCLUSION', // Sanoat xavfsizligi ekspertiza xulosalarini ro‘yxatdan chiqarish

  // Litsenziya va ruxsatnomalar
  ObtainLicense = 'OBTAIN_LICENSE', // Litsenziya olish
  ObtainPermit = 'OBTAIN_PERMIT', // Ruxsatnoma olish
  ObtainConclusion = 'OBTAIN_CONCLUSION', // Xulosa olish

  // Xavfli ishlab chiqarish obyektlari kadastr pasporti
  RegisterHPOCadastrePassport = 'REGISTER_HPO_CADASTRE_PASSPORT', // Xavfli ishlab chiqarish obyektlari kadastr pasportini ro‘yxatga olish
  DeregisterHPOCadastrePassport = 'DEREGISTER_HPO_CADASTRE_PASSPORT', // Xavfli ishlab chiqarish obyektlari kadastr pasportini ro‘yxatdan chiqarish

  // Sanoat xavfsizligi deklaratsiyasi
  RegisterSafetyDeclaration = 'REGISTER_SAFETY_DECLARATION', // Sanoat xavfsizligi deklaratsiyasini ro‘yxatga olish
  DeregisterSafetyDeclaration = 'DEREGISTER_SAFETY_DECLARATION', // Sanoat xavfsizligi deklaratsiyasini ro‘yxatdan chiqarish

  // INM (Individual Number for Manufacturing)
  ObtainINM = 'OBTAIN_INM', // INMni olish
  IssueINM = 'ISSUE_INM', // INMni berish
  RegisterINM = 'REGISTER_INM', // INMni ro‘yxatga olish
  DeregisterINM = 'DEREGISTER_INM', // INMni ro‘yxatdan chiqarish

  // Boshqa yo‘nalishlar
  Other = 'OTHER', // Boshqa yo‘nalishlar
}
