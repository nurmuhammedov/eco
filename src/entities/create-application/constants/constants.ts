import {
  ApplicationCardItem,
  ApplicationCategory,
  ApplicationTypeEnum,
  MainApplicationCategory,
} from '@/entities/create-application';
import { FileInput, FileOutput, FilePlus } from 'lucide-react';

export const APPLICATION_CATEGORIES = [
  {
    id: ApplicationCategory.XICHO,
    name: 'XICHO',
  },
  {
    id: ApplicationCategory.HOKQ,
    name: 'Xavfli obyektlar va qurilmalar',
  },
  {
    id: ApplicationCategory.INM,
    name: 'INM',
  },
  {
    id: ApplicationCategory.ACCREDITATION,
    name: 'Akkreditatsiya',
  },
  {
    id: ApplicationCategory.ATTESTATION_PREVENTION,
    name: 'Attestatsiya va profilaktika',
  },
  {
    id: ApplicationCategory.CADASTRE,
    name: 'Kadastr',
  },
];

export const MAIN_APPLICATION_BY_CATEGORY = {
  [ApplicationCategory.HOKQ]: [
    {
      id: MainApplicationCategory.REGISTER,
      title: 'Xavfli obyekt va qurilmalarni ro‘yxatga olish',
      description: 'Xavfli obyekt va qurilmalarni davlat ro‘yxatiga olish ariza shakllari',
      icon: FileInput,
    },
    {
      id: MainApplicationCategory.UNREGISTER,
      title: 'Xavfli obyekt va qurilmalarni ro‘yxatdan chiqarish',
      description: 'Xavfli obyekt va qurilmalarni ro‘yxatdan chiqarish ariza shakllari',
      icon: FileOutput,
    },
    {
      id: MainApplicationCategory.REREGISTER,
      title: 'Xavfli obyekt va qurilmalarni qayta ro‘yxatdan o‘tkazish',
      description: 'Xavfli obyekt va qurilmalarni qayta ro‘yxatdan o‘tkazish ariza shakllari',
      icon: FilePlus,
    },
  ],
  [ApplicationCategory.INM]: [],
  [ApplicationCategory.XICHO]: [],
  [ApplicationCategory.CADASTRE]: [],
  [ApplicationCategory.ACCREDITATION]: [],
  [ApplicationCategory.ATTESTATION_PREVENTION]: [],
};

export const APPLICATIONS_DATA: ApplicationCardItem[] = [
  {
    id: 1,
    title: 'XICHOni ro‘yxatga olish',
    description: 'XICHOni ro‘yxatga olish ariza shakli',
    category: ApplicationCategory.XICHO,
    type: ApplicationTypeEnum.REGISTER_HF,
    icon: 'factoryRegisterIcon',
  },
  {
    id: 2,
    title: 'XICHOni ro‘yxatdan chiqarish',
    description: 'XICHOni ro‘yxatdan chiqarish ariza shakli',
    category: ApplicationCategory.XICHO,
    type: ApplicationTypeEnum.DEREGISTER_HF,
    icon: 'factoryDeregisterIcon',
  },
  {
    id: 3,
    title: 'ХИЧО реестрига ўзгартириш киритиш',
    description: 'ХИЧО реестрига ўзгартириш киритиш учун ариза шакли',
    category: ApplicationCategory.XICHO,
    type: ApplicationTypeEnum.MODIFY_HF,
    icon: 'factoryUpdateIcon',
  },
  // Xavfli obyektlar va qurilmalar => Ro'yxatga olish
  {
    id: 10,
    title: 'Kranni ro‘yxatga olish',
    description: 'Kranni ro‘yxatga olish ariza shakli',
    category: ApplicationCategory.HOKQ,
    type: ApplicationTypeEnum.REGISTER_CRANE,
    parentId: MainApplicationCategory.REGISTER,
    icon: 'crane',
  },
  {
    id: 4,
    title: 'Bosim ostida ishlovchi idishni ro‘yxatga olish',
    description: 'Bosim ostida ishlovchi idishni ro‘yxatga olish ariza shakli',
    category: ApplicationCategory.HOKQ,
    type: ApplicationTypeEnum.REGISTER_CONTAINER, // Yangilandi (RegisterVessel -> REGISTER_CONTAINER)
    parentId: MainApplicationCategory.REGISTER,
    icon: 'pressureVessel',
  },
  {
    id: 5,
    title: 'Bug‘ qozonni ro‘yxatga olish',
    description: 'Bug‘ qozonlarini ro‘yxatga olish ariza shakli',
    category: ApplicationCategory.HOKQ,
    type: ApplicationTypeEnum.REGISTER_BOILER, // Yangilandi (RegisterSteamAndHotWaterPipeline -> REGISTER_BOILER)
    parentId: MainApplicationCategory.REGISTER,
    icon: 'boiler',
  },
  {
    id: 6,
    title: 'Liftni ro‘yxatga olish',
    description: 'Liftni ro‘yxatga olish ariza shakli',
    category: ApplicationCategory.HOKQ,
    type: ApplicationTypeEnum.REGISTER_ELEVATOR, // Yangilandi (RegisterLift -> REGISTER_ELEVATOR)
    parentId: MainApplicationCategory.REGISTER,
    icon: 'elevator',
  },
  {
    id: 7,
    title: 'Eskalatorni ro‘yxatga olish',
    description: 'Eskalatorni ro‘yxatga olish ariza shakli',
    category: ApplicationCategory.HOKQ,
    type: ApplicationTypeEnum.REGISTER_ESCALATOR, // Yangilandi
    parentId: MainApplicationCategory.REGISTER,
    icon: 'escalator',
  },
  {
    id: 8,
    title: 'Attraksion pasportini ro‘yxatga olish',
    description: 'Attraksion pasportlarini rasmiylashtirish ariza shakli',
    category: ApplicationCategory.HOKQ,
    type: ApplicationTypeEnum.REGISTER_ATTRACTION_PASSPORT, // Yangilandi
    parentId: MainApplicationCategory.REGISTER,
    icon: 'passport',
  },
  {
    id: 9,
    title: 'Attraksionni ro‘yxatga olish',
    description: 'Attraksion qurilmalarini ro‘yxatga olish ariza shakli',
    category: ApplicationCategory.HOKQ,
    type: ApplicationTypeEnum.REGISTER_ATTRACTION, // Yangilandi
    parentId: MainApplicationCategory.REGISTER,
    icon: 'attraction',
  },
  {
    id: 11,
    title: 'Quvurni ro‘yxatga olish',
    description: 'Quvurlarni ro‘yxatga olish ariza shakli',
    category: ApplicationCategory.HOKQ,
    type: ApplicationTypeEnum.REGISTER_PIPELINE, // Yangilandi
    parentId: MainApplicationCategory.REGISTER,
    icon: 'pipeSystem',
  },
  {
    id: 12,
    title: 'Bosim ostida ishlovchi idishlarni (kimyo) ro‘yxatga olish',
    description: 'Bosim ostida ishlovchi idishlarni (kimyo) ro‘yxatga olish ariza shakli',
    category: ApplicationCategory.HOKQ,
    type: ApplicationTypeEnum.REGISTER_CHEMICAL_CONTAINER, // Yangilandi
    parentId: MainApplicationCategory.REGISTER,
    icon: 'chemicalVessel',
  },
  {
    id: 13,
    title: 'Bug‘ va issiq suv quvurlarini ro‘yxatga olish',
    description: 'Bug‘ va issiq suv quvurlarini ro‘yxatga olish ariza shakli',
    category: ApplicationCategory.HOKQ,
    type: ApplicationTypeEnum.REGISTER_HEAT_PIPELINE, // Yangilandi
    parentId: MainApplicationCategory.REGISTER,
    icon: 'steamPipe',
  },
  {
    id: 14,
    title: 'Qozon utilizatorlarini ro‘yxatga olish',
    description: 'Qozon utilizatorlarini ro‘yxatga olish ariza shakli',
    category: ApplicationCategory.HOKQ,
    type: ApplicationTypeEnum.REGISTER_BOILER_UTILIZER, // Yangilandi
    parentId: MainApplicationCategory.REGISTER,
    icon: 'recycleBoiler',
  },
  {
    id: 15,
    title: 'Bosim ostida ishlovchi idishlarni (SUG) ro‘yxatga olish',
    description: 'Bosim ostida ishlovchi idishlarni (SUG) ro‘yxatga olish ariza shakli',
    category: ApplicationCategory.HOKQ,
    type: ApplicationTypeEnum.REGISTER_LPG_CONTAINER, // Yangilandi
    parentId: MainApplicationCategory.REGISTER,
    icon: 'gasVessel',
  },
  {
    id: 16,
    title: 'Yiliga 100 ming va undan ortiq kubometr tabiiy gazdan foydalanuvchi qurilmalarni ro‘yxatga olish',
    description:
      'Yiliga 100 ming va undan ortiq kubometr tabiiy gazdan foydalanuvchi qurilmalarni ro‘yxatga olish ariza shakli',
    category: ApplicationCategory.HOKQ,
    // type: ApplicationTypeEnum.REGISTER_HIGH_GAS_USAGE_EQUIPMENT, // Bu enum yangi ro'yxatda yo'q, izohga olinadi yoki moslashtiriladi
    type: ApplicationTypeEnum.REGISTER_LPG_POWERED, // Vaqtinchalik moslashtirish, asl enum qiymatini aniqlash kerak
    parentId: MainApplicationCategory.REGISTER,
    icon: 'naturalGas',
  },
  {
    id: 17,
    title: 'Yuk ko‘targichni ro‘yxatga olish',
    description: 'Yuk ko‘targichni ro‘yxatga olish ariza shakli',
    category: ApplicationCategory.HOKQ,
    type: ApplicationTypeEnum.REGISTER_HOIST, // Yangilandi (RegisterElevator -> REGISTER_HOIST)
    parentId: MainApplicationCategory.REGISTER,
    icon: 'heavyLift',
  },
  {
    id: 18,
    title: 'Osma arqonli yuruvchi yo‘lni ro‘yxatga olish',
    description: 'Osma arqonli yuruvchi yo‘lni ro‘yxatga olish ariza shakli',
    category: ApplicationCategory.HOKQ,
    type: ApplicationTypeEnum.REGISTER_CABLEWAY, // Yangilandi (RegisterBridgeOrRoad -> REGISTER_CABLEWAY)
    parentId: MainApplicationCategory.REGISTER,
    icon: 'cableway',
  },
  // INM
  {
    id: 19,
    title: 'Ionlashtiruvchi nurlanish manbalarini ro‘yxatga olish',
    description: 'Ionlashtiruvchi nurlanish manbalarini ro‘yxatga olish ariza shakli',
    category: ApplicationCategory.INM,
    type: ApplicationTypeEnum.REGISTER_IRS, // Yangilandi
    icon: 'radiationRegisterIcon',
  },
  {
    id: 20,
    title: 'Ionlashtiruvchi nurlanish manbalarini qabul qilish', // Olinishi -> qabul qilish
    description: 'Ionlashtiruvchi nurlanish manbalarini qabul qilish uchun ariza shakli',
    category: ApplicationCategory.INM,
    type: ApplicationTypeEnum.ACCEPT_IRS, // Yangilandi
    icon: 'radiationReceiveIcon',
  },
  {
    id: 21,
    title: 'Ionlashtiruvchi nurlanish manbalarini topshirish', // Berilishi -> topshirish
    description: 'Ionlashtiruvchi nurlanish manbalarini topshirish uchun ariza shakli',
    category: ApplicationCategory.INM,
    type: ApplicationTypeEnum.TRANSFER_IRS, // Yangilandi
    icon: 'radiationTransferIcon',
  },
  // Akkreditatsiya - bu turlar yangi ApplicationTypeEnum ro'yxatida yo'q, shuning uchun izohga olinadi
  {
    id: 22,
    title: 'Ekspert tashkilotini akkreditatsiyadan o‘tkazish',
    description: 'Ekspert tashkilotini akkreditatsiyadan o‘tkazish ariza shakli',
    category: ApplicationCategory.ACCREDITATION,
    type: ApplicationTypeEnum.DEFAULT,
    icon: 'expertOrgAccreditationIcon',
  },
  {
    id: 23,
    title: 'Ekspert tashkilotini qayta akkreditatsiyadan o‘tkazish',
    description: 'Ekspert tashkilotini qayta akkreditatsiyadan o‘tkazish ariza shakli',
    category: ApplicationCategory.ACCREDITATION,
    type: ApplicationTypeEnum.DEFAULT,
    icon: 'expertOrgReaccreditationIcon',
  },
  {
    id: 24,
    title: 'Ekspert tashkilotining akkreditatsiya sohasini kengaytirish',
    description: 'Ekspert tashkilotining akkreditatsiya sohasini kengaytirish ariza shakli',
    category: ApplicationCategory.ACCREDITATION,
    type: ApplicationTypeEnum.DEFAULT,
    icon: 'expertOrgExpandAccreditationIcon',
  },
  {
    id: 25,
    title: 'Sanoat xavfsizligi ekspertiza xulosalarini ro‘yxatga olish',
    description: 'Sanoat xavfsizligi ekspertiza xulosalarini ro‘yxatga olish ariza shakli',
    category: ApplicationCategory.ACCREDITATION,
    type: ApplicationTypeEnum.DEFAULT,
    icon: 'industrialSafetyExpertiseRegistrationIcon',
  },
  // Attestatsiya - bu turlar yangi ApplicationTypeEnum ro'yxatida yo'q, shuning uchun izohga olinadi
  {
    id: 26,
    title: 'XICHO xodimlarini attestatsiyadan o‘tkazish',
    description: 'XICHO xodimlarini attestatsiyadan o‘tkazish ariza shakli',
    category: ApplicationCategory.ATTESTATION_PREVENTION,
    type: ApplicationTypeEnum.DEFAULT,
    icon: 'staffAttestationIcon',
  },
  {
    id: 27,
    title: 'Profilaktika tadbirini o‘tkazish',
    description: 'Profilaktika tadbirini o‘tkazish ariza shakli',
    category: ApplicationCategory.ATTESTATION_PREVENTION,
    type: ApplicationTypeEnum.DEFAULT,
    icon: 'preventiveMeasuresIcon',
  },
];
