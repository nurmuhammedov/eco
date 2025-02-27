import { ApplicationTypeEnum } from '../model/application.types.ts';
import {
  ContainerType,
  CraneType,
  LiftType,
} from '../model/application.enums.ts';

export const APPLICATIONS_TYPES = [
  {
    value: ApplicationTypeEnum.RegisterHPO,
    label: 'XICHO ni ro‘yxatdan o‘tkazish',
  },
  {
    value: ApplicationTypeEnum.DeregisterHPO,
    label: 'XICHO ni ro‘yxatdan chiqarish',
  },
  {
    value: ApplicationTypeEnum.RegisterCrane,
    label: 'Kranni ro‘yxatga olish',
  },
  {
    value: ApplicationTypeEnum.RegisterVessel,
    label: 'Sosudni ro‘yxatga olish',
  },
  {
    value: ApplicationTypeEnum.RegisterBoiler,
    label: 'Qozonni ro‘yxatga olish',
  },
  {
    value: ApplicationTypeEnum.RegisterLift,
    label: 'Liftni ro‘yxatga olish',
  },
  {
    value: ApplicationTypeEnum.RegisterEscalator,
    label: 'Eskalatorni ro‘yxatga olish',
  },
  {
    value: ApplicationTypeEnum.RegisterBridgeOrRoad,
    label: "Ko'prik/yo'lni ro‘yxatga olish",
  },
  {
    value: ApplicationTypeEnum.RegisterElevator,
    label: 'Ko‘tarmani ro‘yxatga olish',
  },
  {
    value: ApplicationTypeEnum.RegisterPipeline,
    label: 'Quvurni ro‘yxatga olish',
  },
  {
    value: ApplicationTypeEnum.RegisterAttraction,
    label: 'Attraksionni ro‘yxatga olish',
  },
  {
    value: ApplicationTypeEnum.RegisterAttractionPassport,
    label: 'Attraksion pasportini ro‘yxatga olish',
  },
  {
    value: ApplicationTypeEnum.RegisterPressureVesselChemical,
    label: 'Bosim ostida ishlovchi idishlar(kimyo)ni ro‘yxatga olish',
  },
  {
    value: ApplicationTypeEnum.RegisterPressureVesselLPG,
    label: 'Bosim ostida ishlovchi idishlar(SUG)ni ro‘yxatga olish',
  },
  {
    value: ApplicationTypeEnum.RegisterSteamAndHotWaterPipeline,
    label: 'Bug‘ va issiq suv quvurlarini ro‘yxatga olish',
  },
  {
    value: ApplicationTypeEnum.RegisterBoilerUtilizer,
    label: 'Qozon utilizatorlarini ro‘yxatga olish',
  },
  {
    value: ApplicationTypeEnum.RegisterHighGasUsageEquipment,
    label:
      'Yiliga 100 ming va undan ortiq kubometr tabiiy gazdan foydalanuvchi qurilmalarni ro‘yxatga olish',
  },
  // ro'yxatdan chiqarish
  {
    value: ApplicationTypeEnum.DeregisterCrane,
    label: 'Kranni ro‘yxatdan chiqarish',
  },
  {
    value: ApplicationTypeEnum.DeregisterVessel,
    label: 'Sosudni ro‘yxatdan chiqarish',
  },
  {
    value: ApplicationTypeEnum.DeregisterBoiler,
    label: 'Qozonni ro‘yxatdan chiqarish',
  },
  {
    value: ApplicationTypeEnum.DeregisterLift,
    label: 'Liftni ro‘yxatdan chiqarish',
  },
  {
    value: ApplicationTypeEnum.DeregisterEscalator,
    label: 'Eskalatorni ro‘yxatdan chiqarish',
  },
  {
    value: ApplicationTypeEnum.DeregisterBridgeOrRoad,
    label: "Ko'prik/yo'lni ro‘yxatdan chiqarish",
  },
  {
    value: ApplicationTypeEnum.DeregisterElevator,
    label: "Ko'tarmani' ro‘yxatdan chiqarish",
  },
  {
    value: ApplicationTypeEnum.DeregisterPipeline,
    label: 'Quvurni ro‘yxatdan chiqarish',
  },
  {
    value: ApplicationTypeEnum.DeregisterAttraction,
    label: "Attraksionni' ro‘yxatdan chiqarish",
  },
  {
    value: ApplicationTypeEnum.DeregisterAttractionPassport,
    label: "Attraksion pasportini' ro‘yxatdan chiqarish",
  },
  //
  {
    value: ApplicationTypeEnum.CertifyHPOEmployee,
    label: 'XICHO xodimlarini attestatsiyadan o‘tkazish',
  },
  {
    value: ApplicationTypeEnum.AccreditExpertOrganization,
    label: 'Ekspert tashkilotini akkreditatsiya qilish',
  },
  {
    value: ApplicationTypeEnum.RegisterSafetyExpertConclusion,
    label: 'Sanoat xavfsizligi ekspertiza xulosalarini ro‘yxatga olish',
  },
  {
    value: ApplicationTypeEnum.DeregisterSafetyExpertConclusion,
    label: 'Sanoat xavfsizligi ekspertiza xulosalarini ro‘yxatdan chiqarish',
  },
  {
    value: ApplicationTypeEnum.ObtainLicense,
    label: 'Litsenziya olish',
  },
  {
    value: ApplicationTypeEnum.ObtainPermit,
    label: 'Ruxsatnoma olish',
  },
  {
    value: ApplicationTypeEnum.ObtainConclusion,
    label: 'Xulosa olish',
  },
  {
    value: ApplicationTypeEnum.RegisterHPOCadastrePassport,
    label: 'XICHO ning kadastr passportini ro‘yxatga olish',
  },
  {
    value: ApplicationTypeEnum.DeregisterHPOCadastrePassport,
    label: 'XICHO ning kadastr passportini ro‘yxatdan chiqarish',
  },
  {
    value: ApplicationTypeEnum.RegisterSafetyDeclaration,
    label: 'Sanoat xavfsizligi deklaratsiyasini ro‘yxatga olish',
  },
  {
    value: ApplicationTypeEnum.DeregisterSafetyDeclaration,
    label: 'Sanoat xavfsizligi deklaratsiyasini ro‘yxatdan chiqarish',
  },
  {
    value: ApplicationTypeEnum.ObtainINM,
    label: 'INM ni olish',
  },
  {
    value: ApplicationTypeEnum.IssueINM,
    label: 'INM ni berish',
  },
  {
    value: ApplicationTypeEnum.RegisterINM,
    label: 'INM ni ro‘yxatga olish',
  },
  {
    value: ApplicationTypeEnum.DeregisterINM,
    label: 'INM ni ro‘yxatdan chiqarish',
  },
  {
    value: ApplicationTypeEnum.Other,
    label: 'Boshqa yo‘nalishlar',
  },
];

export const CONTAINER_TYPES = [
  {
    value: ContainerType.Steam,
    label: "Bug'li",
  },
  {
    value: ContainerType.AccumulatorCylinder,
    label: 'Akkumlyator balloni',
  },
  {
    value: ContainerType.MobileVessel,
    label: 'Harakatlanuvchi idish',
  },
  {
    value: ContainerType.AirCollector,
    label: "Havo yig'gich",
  },
  {
    value: ContainerType.Receiver,
    label: 'Qabul qiluvchi',
  },
  {
    value: ContainerType.Separator,
    label: 'Separator',
  },
];

export const CRANE_TYPES = [
  {
    value: CraneType.Bridge,
    label: "Ko'prikli",
  },
  {
    value: CraneType.Crawler,
    label: "O'zi sudralib yuruvchi",
  },
  {
    value: CraneType.Funicular,
    label: 'Funikulyar',
  },
  {
    value: CraneType.Gantry,
    label: 'Kozlovoy',
  },
  {
    value: CraneType.Manipulator,
    label: 'Manipulyator',
  },
  {
    value: CraneType.PipeLayer,
    label: 'Truboukladchik',
  },
  {
    value: CraneType.TireTrimmed,
    label: 'Pnevmoxodli',
  },
  {
    value: CraneType.Tower,
    label: 'Minorali',
  },
  {
    value: CraneType.Truck,
    label: 'Avtokran',
  },
];

export const LIFT_TYPES = [
  {
    value: LiftType.Hospital,
    label: 'Kasalxonalar uchun',
  },
  {
    value: LiftType.Freight,
    label: "Yuk ko'taruvchi",
  },
];
