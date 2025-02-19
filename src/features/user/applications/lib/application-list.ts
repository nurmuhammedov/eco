import { ApplicationType } from '@/entities/user/applications/model/application.types';

export const APPLICATION_LIST = [
  {
    key: ApplicationType.RegisterHPO,
    label: 'Xavfli Ishlab Chiqarish Obyektini ro‘yxatdan o‘tkazish',
  },
  {
    key: ApplicationType.DeregisterHPO,
    label: 'Xavfli Ishlab Chiqarish Obyektini ro‘yxatdan chiqarish',
  },
  { key: ApplicationType.RegisterCrane, label: 'Kranni ro‘yxatga olish' },
  { key: ApplicationType.RegisterVessel, label: 'Soudni ro‘yxatga olish' },
  { key: ApplicationType.RegisterBoiler, label: 'Kotelni ro‘yxatga olish' },
  { key: ApplicationType.RegisterLift, label: 'Liftni ro‘yxatga olish' },
  {
    key: ApplicationType.RegisterEscalator,
    label: 'Eskalatorni ro‘yxatga olish',
  },
  {
    key: ApplicationType.RegisterBridgeOrRoad,
    label: 'Ko‘prik/Yo‘lni ro‘yxatga olish',
  },
  {
    key: ApplicationType.RegisterElevator,
    label: 'Ko‘tarmani (podъемникni) ro‘yxatga olish',
  },
  {
    key: ApplicationType.RegisterPipeline,
    label: 'Quvurni (truboprovodni) ro‘yxatga olish',
  },
  {
    key: ApplicationType.DeregisterCrane,
    label: 'Kranni ro‘yxatdan chiqarish',
  },
  {
    key: ApplicationType.DeregisterVessel,
    label: 'Soudni ro‘yxatdan chiqarish',
  },
  {
    key: ApplicationType.DeregisterBoiler,
    label: 'Kotelni ro‘yxatdan chiqarish',
  },
  { key: ApplicationType.DeregisterLift, label: 'Liftni ro‘yxatdan chiqarish' },
  {
    key: ApplicationType.DeregisterEscalator,
    label: 'Eskalatorni ro‘yxatdan chiqarish',
  },
  {
    key: ApplicationType.DeregisterBridgeOrRoad,
    label: 'Ko‘prik/Yo‘lni ro‘yxatdan chiqarish',
  },
  {
    key: ApplicationType.DeregisterElevator,
    label: 'Ko‘tarmani (podъемникni) ro‘yxatdan chiqarish',
  },
  {
    key: ApplicationType.DeregisterPipeline,
    label: 'Quvurni (truboprovodni) ro‘yxatdan chiqarish',
  },
  {
    key: ApplicationType.CertifyHPOEmployee,
    label:
      'Xavfli ishlab chiqarish obyektlari xodimlarini attestatsiyadan o‘tkazish',
  },
  {
    key: ApplicationType.AccreditExpertOrganization,
    label: 'Ekspert tashkilotini akkreditatsiya qilish',
  },
  {
    key: ApplicationType.RegisterSafetyExpertConclusion,
    label: 'Sanoat xavfsizligi ekspertiza xulosalarini ro‘yxatga olish',
  },
  {
    key: ApplicationType.DeregisterSafetyExpertConclusion,
    label: 'Sanoat xavfsizligi ekspertiza xulosalarini ro‘yxatdan chiqarish',
  },
  { key: ApplicationType.ObtainLicense, label: 'Litsenziya olish' },
  { key: ApplicationType.ObtainPermit, label: 'Ruxsatnoma olish' },
  { key: ApplicationType.ObtainConclusion, label: 'Xulosa olish' },
  {
    key: ApplicationType.RegisterHPOCadastrePassport,
    label:
      'Xavfli ishlab chiqarish obyektlari kadastr pasportini ro‘yxatga olish',
  },
  {
    key: ApplicationType.DeregisterHPOCadastrePassport,
    label:
      'Xavfli ishlab chiqarish obyektlari kadastr pasportini ro‘yxatdan chiqarish',
  },
  {
    key: ApplicationType.RegisterSafetyDeclaration,
    label: 'Sanoat xavfsizligi deklaratsiyasini ro‘yxatga olish',
  },
  {
    key: ApplicationType.DeregisterSafetyDeclaration,
    label: 'Sanoat xavfsizligi deklaratsiyasini ro‘yxatdan chiqarish',
  },
  { key: ApplicationType.ObtainINM, label: 'INMni olish' },
  { key: ApplicationType.IssueINM, label: 'INMni berish' },
  { key: ApplicationType.RegisterINM, label: 'INMni ro‘yxatga olish' },
  { key: ApplicationType.DeregisterINM, label: 'INMni ro‘yxatdan chiqarish' },
  { key: ApplicationType.Other, label: 'Boshqa yo‘nalishlar' },
];
