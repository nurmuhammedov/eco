import { ApplicationTypeEnum } from '../model/application.types.ts';
import { ContainerType, CraneType, LiftType } from '../model/application.enums.ts';

export const APPLICATIONS_TYPES = [
  {
    id: ApplicationTypeEnum.RegisterHPO,
    name: 'XICHO ni ro‘yxatdan o‘tkazish',
  },
  {
    id: ApplicationTypeEnum.DeregisterHPO,
    name: 'XICHO ni ro‘yxatdan chiqarish',
  },
  {
    id: ApplicationTypeEnum.RegisterCrane,
    name: 'Kranni ro‘yxatga olish',
  },
  {
    id: ApplicationTypeEnum.RegisterVessel,
    name: 'Sosudni ro‘yxatga olish',
  },
  {
    id: ApplicationTypeEnum.RegisterBoiler,
    name: 'Qozonni ro‘yxatga olish',
  },
  {
    id: ApplicationTypeEnum.RegisterLift,
    name: 'Liftni ro‘yxatga olish',
  },
  {
    id: ApplicationTypeEnum.RegisterEscalator,
    name: 'Eskalatorni ro‘yxatga olish',
  },
  {
    id: ApplicationTypeEnum.RegisterBridgeOrRoad,
    name: "Ko'prik/yo'lni ro‘yxatga olish",
  },
  {
    id: ApplicationTypeEnum.RegisterElevator,
    name: 'Ko‘tarmani ro‘yxatga olish',
  },
  {
    id: ApplicationTypeEnum.RegisterPipeline,
    name: 'Quvurni ro‘yxatga olish',
  },
  {
    id: ApplicationTypeEnum.RegisterAttraction,
    name: 'Attraksionni ro‘yxatga olish',
  },
  {
    id: ApplicationTypeEnum.RegisterAttractionPassport,
    name: 'Attraksion pasportini ro‘yxatga olish',
  },
  {
    id: ApplicationTypeEnum.RegisterPressureVesselChemical,
    name: 'Bosim ostida ishlovchi idishlar(kimyo)ni ro‘yxatga olish',
  },
  {
    id: ApplicationTypeEnum.RegisterPressureVesselLPG,
    name: 'Bosim ostida ishlovchi idishlar(SUG)ni ro‘yxatga olish',
  },
  {
    id: ApplicationTypeEnum.RegisterSteamAndHotWaterPipeline,
    name: 'Bug‘ va issiq suv quvurlarini ro‘yxatga olish',
  },
  {
    id: ApplicationTypeEnum.RegisterBoilerUtilizer,
    name: 'Qozon utilizatorlarini ro‘yxatga olish',
  },
  {
    id: ApplicationTypeEnum.RegisterHighGasUsageEquipment,
    name: 'Yiliga 100 ming va undan ortiq kubometr tabiiy gazdan foydalanuvchi qurilmalarni ro‘yxatga olish',
  },
  // ro'yxatdan chiqarish
  {
    id: ApplicationTypeEnum.DeregisterCrane,
    name: 'Kranni ro‘yxatdan chiqarish',
  },
  {
    id: ApplicationTypeEnum.DeregisterVessel,
    name: 'Sosudni ro‘yxatdan chiqarish',
  },
  {
    id: ApplicationTypeEnum.DeregisterBoiler,
    name: 'Qozonni ro‘yxatdan chiqarish',
  },
  {
    id: ApplicationTypeEnum.DeregisterLift,
    name: 'Liftni ro‘yxatdan chiqarish',
  },
  {
    id: ApplicationTypeEnum.DeregisterEscalator,
    name: 'Eskalatorni ro‘yxatdan chiqarish',
  },
  {
    id: ApplicationTypeEnum.DeregisterBridgeOrRoad,
    name: "Ko'prik/yo'lni ro‘yxatdan chiqarish",
  },
  {
    id: ApplicationTypeEnum.DeregisterElevator,
    name: "Ko'tarmani' ro‘yxatdan chiqarish",
  },
  {
    id: ApplicationTypeEnum.DeregisterPipeline,
    name: 'Quvurni ro‘yxatdan chiqarish',
  },
  {
    id: ApplicationTypeEnum.DeregisterAttraction,
    name: "Attraksionni' ro‘yxatdan chiqarish",
  },
  {
    id: ApplicationTypeEnum.DeregisterAttractionPassport,
    name: "Attraksion pasportini' ro‘yxatdan chiqarish",
  },
  //
  {
    id: ApplicationTypeEnum.CertifyHPOEmployee,
    name: 'XICHO xodimlarini attestatsiyadan o‘tkazish',
  },
  {
    id: ApplicationTypeEnum.AccreditExpertOrganization,
    name: 'Ekspert tashkilotini akkreditatsiya qilish',
  },
  {
    id: ApplicationTypeEnum.RegisterSafetyExpertConclusion,
    name: 'Sanoat xavfsizligi ekspertiza xulosalarini ro‘yxatga olish',
  },
  {
    id: ApplicationTypeEnum.DeregisterSafetyExpertConclusion,
    name: 'Sanoat xavfsizligi ekspertiza xulosalarini ro‘yxatdan chiqarish',
  },
  {
    id: ApplicationTypeEnum.ObtainLicense,
    name: 'Litsenziya olish',
  },
  {
    id: ApplicationTypeEnum.ObtainPermit,
    name: 'Ruxsatnoma olish',
  },
  {
    id: ApplicationTypeEnum.ObtainConclusion,
    name: 'Xulosa olish',
  },
  {
    id: ApplicationTypeEnum.RegisterHPOCadastrePassport,
    name: 'XICHO ning kadastr passportini ro‘yxatga olish',
  },
  {
    id: ApplicationTypeEnum.DeregisterHPOCadastrePassport,
    name: 'XICHO ning kadastr passportini ro‘yxatdan chiqarish',
  },
  {
    id: ApplicationTypeEnum.RegisterSafetyDeclaration,
    name: 'Sanoat xavfsizligi deklaratsiyasini ro‘yxatga olish',
  },
  {
    id: ApplicationTypeEnum.DeregisterSafetyDeclaration,
    name: 'Sanoat xavfsizligi deklaratsiyasini ro‘yxatdan chiqarish',
  },
  {
    id: ApplicationTypeEnum.ObtainINM,
    name: 'INM ni olish',
  },
  {
    id: ApplicationTypeEnum.IssueINM,
    name: 'INM ni berish',
  },
  {
    id: ApplicationTypeEnum.RegisterINM,
    name: 'INM ni ro‘yxatga olish',
  },
  {
    id: ApplicationTypeEnum.DeregisterINM,
    name: 'INM ni ro‘yxatdan chiqarish',
  },
  {
    id: ApplicationTypeEnum.Other,
    name: 'Boshqa yo‘nalishlar',
  },
];

export const CONTAINER_TYPES = [
  {
    id: ContainerType.Steam,
    name: "Bug'li",
  },
  {
    id: ContainerType.AccumulatorCylinder,
    name: 'Akkumlyator balloni',
  },
  {
    id: ContainerType.MobileVessel,
    name: 'Harakatlanuvchi idish',
  },
  {
    id: ContainerType.AirCollector,
    name: "Havo yig'gich",
  },
  {
    id: ContainerType.Receiver,
    name: 'Qabul qiluvchi',
  },
  {
    id: ContainerType.Separator,
    name: 'Separator',
  },
];

export const CRANE_TYPES = [
  {
    id: CraneType.Bridge,
    name: "Ko'prikli",
  },
  {
    id: CraneType.Crawler,
    name: "O'zi sudralib yuruvchi",
  },
  {
    id: CraneType.Funicular,
    name: 'Funikulyar',
  },
  {
    id: CraneType.Gantry,
    name: 'Kozlovoy',
  },
  {
    id: CraneType.Manipulator,
    name: 'Manipulyator',
  },
  {
    id: CraneType.PipeLayer,
    name: 'Truboukladchik',
  },
  {
    id: CraneType.TireTrimmed,
    name: 'Pnevmoxodli',
  },
  {
    id: CraneType.Tower,
    name: 'Minorali',
  },
  {
    id: CraneType.Truck,
    name: 'Avtokran',
  },
];

export const LIFT_TYPES = [
  {
    id: LiftType.Hospital,
    name: 'Kasalxonalar uchun',
  },
  {
    id: LiftType.Freight,
    name: "Yuk ko'taruvchi",
  },
];
