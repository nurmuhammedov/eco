import { ApplicationTypeEnum } from '@/entities/user/applications/model/application.types';

export const APPLICATION_LIST = [
  {
    key: ApplicationTypeEnum.RegisterHPO,
    label: 'Xavfli Ishlab Chiqarish Obyektini ro‘yxatdan o‘tkazish',
  },
  {
    key: ApplicationTypeEnum.DeregisterHPO,
    label: 'Xavfli Ishlab Chiqarish Obyektini ro‘yxatdan chiqarish',
  },
  { key: ApplicationTypeEnum.RegisterCrane, label: 'Kranni ro‘yxatga olish' },
  { key: ApplicationTypeEnum.RegisterVessel, label: 'Soudni ro‘yxatga olish' },
  { key: ApplicationTypeEnum.RegisterBoiler, label: 'Kotelni ro‘yxatga olish' },
  { key: ApplicationTypeEnum.RegisterLift, label: 'Liftni ro‘yxatga olish' },
  {
    key: ApplicationTypeEnum.RegisterEscalator,
    label: 'Eskalatorni ro‘yxatga olish',
  },
  {
    key: ApplicationTypeEnum.RegisterBridgeOrRoad,
    label: 'Ko‘prik/Yo‘lni ro‘yxatga olish',
  },
  {
    key: ApplicationTypeEnum.RegisterElevator,
    label: 'Ko‘tarmani (podъемникni) ro‘yxatga olish',
  },
  {
    key: ApplicationTypeEnum.RegisterPipeline,
    label: 'Quvurni (truboprovodni) ro‘yxatga olish',
  },
  {
    key: ApplicationTypeEnum.DeregisterCrane,
    label: 'Kranni ro‘yxatdan chiqarish',
  },
  {
    key: ApplicationTypeEnum.DeregisterVessel,
    label: 'Soudni ro‘yxatdan chiqarish',
  },
  {
    key: ApplicationTypeEnum.DeregisterBoiler,
    label: 'Kotelni ro‘yxatdan chiqarish',
  },
  {
    key: ApplicationTypeEnum.DeregisterLift,
    label: 'Liftni ro‘yxatdan chiqarish',
  },
  {
    key: ApplicationTypeEnum.DeregisterEscalator,
    label: 'Eskalatorni ro‘yxatdan chiqarish',
  },
  {
    key: ApplicationTypeEnum.DeregisterBridgeOrRoad,
    label: 'Ko‘prik/Yo‘lni ro‘yxatdan chiqarish',
  },
  {
    key: ApplicationTypeEnum.DeregisterElevator,
    label: 'Ko‘tarmani (podъемникni) ro‘yxatdan chiqarish',
  },
  {
    key: ApplicationTypeEnum.DeregisterPipeline,
    label: 'Quvurni (truboprovodni) ro‘yxatdan chiqarish',
  },
  {
    key: ApplicationTypeEnum.CertifyHPOEmployee,
    label:
      'Xavfli ishlab chiqarish obyektlari xodimlarini attestatsiyadan o‘tkazish',
  },
  {
    key: ApplicationTypeEnum.AccreditExpertOrganization,
    label: 'Ekspert tashkilotini akkreditatsiya qilish',
  },
  {
    key: ApplicationTypeEnum.RegisterSafetyExpertConclusion,
    label: 'Sanoat xavfsizligi ekspertiza xulosalarini ro‘yxatga olish',
  },
  {
    key: ApplicationTypeEnum.DeregisterSafetyExpertConclusion,
    label: 'Sanoat xavfsizligi ekspertiza xulosalarini ro‘yxatdan chiqarish',
  },
  { key: ApplicationTypeEnum.ObtainLicense, label: 'Litsenziya olish' },
  { key: ApplicationTypeEnum.ObtainPermit, label: 'Ruxsatnoma olish' },
  { key: ApplicationTypeEnum.ObtainConclusion, label: 'Xulosa olish' },
  {
    key: ApplicationTypeEnum.RegisterHPOCadastrePassport,
    label:
      'Xavfli ishlab chiqarish obyektlari kadastr pasportini ro‘yxatga olish',
  },
  {
    key: ApplicationTypeEnum.DeregisterHPOCadastrePassport,
    label:
      'Xavfli ishlab chiqarish obyektlari kadastr pasportini ro‘yxatdan chiqarish',
  },
  {
    key: ApplicationTypeEnum.RegisterSafetyDeclaration,
    label: 'Sanoat xavfsizligi deklaratsiyasini ro‘yxatga olish',
  },
  {
    key: ApplicationTypeEnum.DeregisterSafetyDeclaration,
    label: 'Sanoat xavfsizligi deklaratsiyasini ro‘yxatdan chiqarish',
  },
  { key: ApplicationTypeEnum.ObtainINM, label: 'INMni olish' },
  { key: ApplicationTypeEnum.IssueINM, label: 'INMni berish' },
  { key: ApplicationTypeEnum.RegisterINM, label: 'INMni ro‘yxatga olish' },
  {
    key: ApplicationTypeEnum.DeregisterINM,
    label: 'INMni ro‘yxatdan chiqarish',
  },
  { key: ApplicationTypeEnum.Other, label: 'Boshqa yo‘nalishlar' },
];
