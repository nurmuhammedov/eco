import { ApplicationType } from '@/entities/user/applications/model/application.types';

export const APPLICATIONS_TYPES = [
  {
    value: ApplicationType.RegisterHPO,
    label: 'XICHO ni ro‘yxatdan o‘tkazish',
  },
  {
    value: ApplicationType.DeregisterHPO,
    label: 'XICHO ni ro‘yxatdan chiqarish',
  },
  {
    value: ApplicationType.RegisterCrane,
    label: 'Kranni ro‘yxatga olish',
  },
  {
    value: ApplicationType.RegisterVessel,
    label: 'Sosudni ro‘yxatga olish',
  },
  {
    value: ApplicationType.RegisterBoiler,
    label: 'Qozonni ro‘yxatga olish',
  },
  {
    value: ApplicationType.RegisterLift,
    label: 'Liftni ro‘yxatga olish',
  },
  {
    value: ApplicationType.RegisterEscalator,
    label: 'Eskalatorni ro‘yxatga olish',
  },
  {
    value: ApplicationType.RegisterBridgeOrRoad,
    label: "Ko'prik/yo'lni ro‘yxatga olish",
  },
  {
    value: ApplicationType.RegisterElevator,
    label: 'Ko‘tarmani ro‘yxatga olish',
  },
  {
    value: ApplicationType.RegisterPipeline,
    label: 'Quvurni ro‘yxatga olish',
  },
  {
    value: ApplicationType.RegisterAttraction,
    label: 'Attraksionni ro‘yxatga olish',
  },
  {
    value: ApplicationType.RegisterAttractionPassport,
    label: 'Attraksion pasportini ro‘yxatga olish',
  },
  {
    value: ApplicationType.RegisterPressureVesselChemical,
    label: 'Bosim ostida ishlovchi idishlar(kimyo)ni ro‘yxatga olish',
  },
  {
    value: ApplicationType.RegisterPressureVesselLPG,
    label: 'Bosim ostida ishlovchi idishlar(SUG)ni ro‘yxatga olish',
  },
  {
    value: ApplicationType.RegisterSteamAndHotWaterPipeline,
    label: 'Bug‘ va issiq suv quvurlarini ro‘yxatga olish',
  },
  {
    value: ApplicationType.RegisterBoilerUtilizer,
    label: 'Qozon utilizatorlarini ro‘yxatga olish',
  },
  {
    value: ApplicationType.RegisterHighGasUsageEquipment,
    label:
      'Yiliga 100 ming va undan ortiq kubometr tabiiy gazdan foydalanuvchi qurilmalarni ro‘yxatga olish',
  },
  // ro'yxatdan chiqarish
  {
    value: ApplicationType.DeregisterCrane,
    label: 'Kranni ro‘yxatdan chiqarish',
  },
  {
    value: ApplicationType.DeregisterVessel,
    label: 'Sosudni ro‘yxatdan chiqarish',
  },
  {
    value: ApplicationType.DeregisterBoiler,
    label: 'Qozonni ro‘yxatdan chiqarish',
  },
  {
    value: ApplicationType.DeregisterLift,
    label: 'Liftni ro‘yxatdan chiqarish',
  },
  {
    value: ApplicationType.DeregisterEscalator,
    label: 'Eskalatorni ro‘yxatdan chiqarish',
  },
  {
    value: ApplicationType.DeregisterBridgeOrRoad,
    label: "Ko'prik/yo'lni ro‘yxatdan chiqarish",
  },
  {
    value: ApplicationType.DeregisterElevator,
    label: "Ko'tarmani' ro‘yxatdan chiqarish",
  },
  {
    value: ApplicationType.DeregisterPipeline,
    label: 'Quvurni ro‘yxatdan chiqarish',
  },
  {
    value: ApplicationType.DeregisterAttraction,
    label: "Attraksionni' ro‘yxatdan chiqarish",
  },
  {
    value: ApplicationType.DeregisterAttractionPassport,
    label: "Attraksion pasportini' ro‘yxatdan chiqarish",
  },
  //
  {
    value: ApplicationType.CertifyHPOEmployee,
    label: 'XICHO xodimlarini attestatsiyadan o‘tkazish',
  },
  {
    value: ApplicationType.AccreditExpertOrganization,
    label: 'Ekspert tashkilotini akkreditatsiya qilish',
  },
  {
    value: ApplicationType.RegisterSafetyExpertConclusion,
    label: 'Sanoat xavfsizligi ekspertiza xulosalarini ro‘yxatga olish',
  },
  {
    value: ApplicationType.DeregisterSafetyExpertConclusion,
    label: 'Sanoat xavfsizligi ekspertiza xulosalarini ro‘yxatdan chiqarish',
  },
  {
    value: ApplicationType.ObtainLicense,
    label: 'Litsenziya olish',
  },
  {
    value: ApplicationType.ObtainPermit,
    label: 'Ruxsatnoma olish',
  },
  {
    value: ApplicationType.ObtainConclusion,
    label: 'Xulosa olish',
  },
  {
    value: ApplicationType.RegisterHPOCadastrePassport,
    label: 'XICHO ning kadastr passportini ro‘yxatga olish',
  },
  {
    value: ApplicationType.DeregisterHPOCadastrePassport,
    label: 'XICHO ning kadastr passportini ro‘yxatdan chiqarish',
  },
  {
    value: ApplicationType.RegisterSafetyDeclaration,
    label: 'Sanoat xavfsizligi deklaratsiyasini ro‘yxatga olish',
  },
  {
    value: ApplicationType.DeregisterSafetyDeclaration,
    label: 'Sanoat xavfsizligi deklaratsiyasini ro‘yxatdan chiqarish',
  },
  {
    value: ApplicationType.ObtainINM,
    label: 'INM ni olish',
  },
  {
    value: ApplicationType.IssueINM,
    label: 'INM ni berish',
  },
  {
    value: ApplicationType.RegisterINM,
    label: 'INM ni ro‘yxatga olish',
  },
  {
    value: ApplicationType.DeregisterINM,
    label: 'INM ni ro‘yxatdan chiqarish',
  },
  {
    value: ApplicationType.Other,
    label: 'Boshqa yo‘nalishlar',
  },
];
