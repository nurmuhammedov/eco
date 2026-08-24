import { ApplicationCategory, ApplicationTypeEnum, MainApplicationCategory } from '../types/enums'
import { ApplicationCardItem } from '../types/types'
import { FileInput, FileOutput, FilePlus } from 'lucide-react'

export const APPLICATION_CATEGORIES = [
  {
    id: ApplicationCategory.HF,
    name: 'XICHO',
  },
  {
    id: ApplicationCategory.EQUIPMENTS,
    name: 'Xavfli obyektlar va qurilmalar',
  },
  {
    id: ApplicationCategory.IRS,
    name: 'INM',
  },
  {
    id: ApplicationCategory.XRAY,
    name: 'Rentgen',
  },
]

export const ACCREDITATION_APPLICATION_CATEGORY = {
  id: ApplicationCategory.ACCREDITATION,
  name: 'Akkreditatsiya',
}

export const MAIN_APPLICATION_BY_CATEGORY = {
  [ApplicationCategory.HF]: [],
  [ApplicationCategory.EQUIPMENTS]: [
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
  [ApplicationCategory.IRS]: [],
  [ApplicationCategory.XRAY]: [],
  [ApplicationCategory.ILLEGAL_HF]: [],
  [ApplicationCategory.ACCREDITATION]: [],
}

export const APPLICATIONS_DATA: ApplicationCardItem[] = [
  {
    id: 5,
    title: 'Qurilmani ro‘yxatdan chiqarish',
    name: 'Qurilma',
    description: 'Qurilmani ro‘yxatdan chiqarish ariza shakli',
    category: ApplicationCategory.EQUIPMENTS,
    type: ApplicationTypeEnum.DEREGISTER_EQUIPMENT,
    parentId: MainApplicationCategory.UNREGISTER,
    icon: 'boiler',
  },
  {
    id: 6,
    title: 'Qurilmani qayta ro‘yxatga olish',
    name: 'Qurilma',
    description: 'Qurilmani qayta ro‘yxatga olish ariza shakli',
    category: ApplicationCategory.EQUIPMENTS,
    type: ApplicationTypeEnum.RE_REGISTER_EQUIPMENT,
    parentId: MainApplicationCategory.REREGISTER,
    icon: 'boiler',
  },
  {
    id: 37,
    title: 'Kranni ro‘yxatga olish',
    name: 'Kran',
    description: 'Kranni ro‘yxatga olish ariza shakli',
    category: ApplicationCategory.EQUIPMENTS,
    type: ApplicationTypeEnum.REGISTER_CRANE,
    equipmentType: ApplicationTypeEnum.CRANE,
    parentId: MainApplicationCategory.REGISTER,
    icon: 'crane',
  },
  {
    id: 38,
    title: 'Bosim ostida ishlovchi idishni ro‘yxatga olish',
    name: 'Bosim ostida ishlovchi idish',
    description: 'Bosim ostida ishlovchi idishni ro‘yxatga olish ariza shakli',
    category: ApplicationCategory.EQUIPMENTS,
    type: ApplicationTypeEnum.REGISTER_CONTAINER,
    equipmentType: ApplicationTypeEnum.CONTAINER,
    parentId: MainApplicationCategory.REGISTER,
    icon: 'pressureVessel',
  },
  {
    id: 39,
    title: 'Bug‘ qozonni ro‘yxatga olish',
    name: 'Bug‘ qozon',
    description: 'Bug‘ qozonlarini ro‘yxatga olish ariza shakli',
    category: ApplicationCategory.EQUIPMENTS,
    type: ApplicationTypeEnum.REGISTER_BOILER,
    equipmentType: ApplicationTypeEnum.BOILER,
    parentId: MainApplicationCategory.REGISTER,
    icon: 'boiler',
  },
  {
    id: 41,
    title: 'Eskalatorni ro‘yxatga olish',
    name: 'Eskalator',
    description: 'Eskalatorni ro‘yxatga olish ariza shakli',
    category: ApplicationCategory.EQUIPMENTS,
    type: ApplicationTypeEnum.REGISTER_ESCALATOR,
    equipmentType: ApplicationTypeEnum.ESCALATOR,
    parentId: MainApplicationCategory.REGISTER,
    icon: 'escalator',
  },
  {
    id: 42,
    title: 'Attraksionni ro‘yxatga olish',
    name: 'Attraksion',
    description: 'Attraksion qurilmalarini ro‘yxatga olish ariza shakli',
    category: ApplicationCategory.EQUIPMENTS,
    type: ApplicationTypeEnum.REGISTER_ATTRACTION,
    equipmentType: ApplicationTypeEnum.ATTRACTION,
    parentId: MainApplicationCategory.REGISTER,
    icon: 'attraction',
  },
  {
    id: 43,
    title: 'Quvurni ro‘yxatga olish',
    name: 'Quvur',
    description: 'Quvurlarni ro‘yxatga olish ariza shakli',
    category: ApplicationCategory.EQUIPMENTS,
    type: ApplicationTypeEnum.REGISTER_PIPELINE,
    equipmentType: ApplicationTypeEnum.PIPELINE,
    parentId: MainApplicationCategory.REGISTER,
    icon: 'pipeSystem',
  },
  {
    id: 44,
    title: 'Bosim ostida ishlovchi idishlarni (kimyo) ro‘yxatga olish',
    name: 'Bosim ostida ishlovchi idish (kimyo)',
    description: 'Bosim ostida ishlovchi idishlarni (kimyo) ro‘yxatga olish ariza shakli',
    category: ApplicationCategory.EQUIPMENTS,
    type: ApplicationTypeEnum.REGISTER_CHEMICAL_CONTAINER,
    equipmentType: ApplicationTypeEnum.CHEMICAL_CONTAINER,
    parentId: MainApplicationCategory.REGISTER,
    icon: 'chemicalVessel',
  },
  {
    id: 45,
    title: 'Bug‘ va issiq suv quvurlarini ro‘yxatga olish',
    name: 'Bug‘ va issiq suv quvuri',
    description: 'Bug‘ va issiq suv quvurlarini ro‘yxatga olish ariza shakli',
    category: ApplicationCategory.EQUIPMENTS,
    type: ApplicationTypeEnum.REGISTER_HEAT_PIPELINE,
    equipmentType: ApplicationTypeEnum.HEAT_PIPELINE,
    parentId: MainApplicationCategory.REGISTER,
    icon: 'steamPipe',
  },
  {
    id: 46,
    title: 'Qozon utilizatorlarini ro‘yxatga olish',
    name: 'Qozon utilizatorlarini',
    description: 'Qozon utilizatorlarini ro‘yxatga olish ariza shakli',
    category: ApplicationCategory.EQUIPMENTS,
    type: ApplicationTypeEnum.REGISTER_BOILER_UTILIZER,
    equipmentType: ApplicationTypeEnum.BOILER_UTILIZER,
    parentId: MainApplicationCategory.REGISTER,
    icon: 'recycleBoiler',
  },
  {
    id: 47,
    title: 'Bosim ostida ishlovchi idishlarni (SUG) ro‘yxatga olish',
    name: 'Bosim ostida ishlovchi idishlarni (SUG)',
    description: 'Bosim ostida ishlovchi idishlarni (SUG) ro‘yxatga olish ariza shakli',
    category: ApplicationCategory.EQUIPMENTS,
    type: ApplicationTypeEnum.REGISTER_LPG_CONTAINER,
    equipmentType: ApplicationTypeEnum.LPG_CONTAINER,
    parentId: MainApplicationCategory.REGISTER,
    icon: 'gasVessel',
  },
  {
    id: 48,
    title: 'Yiliga 100 ming va undan ortiq kubometr tabiiy gazdan foydalanuvchi qurilmalarni ro‘yxatga olish',
    name: 'Yiliga 100 ming va undan ortiq kubometr tabiiy gazdan foydalanuvchi qurilma',
    description:
      'Yiliga 100 ming va undan ortiq kubometr tabiiy gazdan foydalanuvchi qurilmalarni ro‘yxatga olish ariza shakli',
    category: ApplicationCategory.EQUIPMENTS,
    type: ApplicationTypeEnum.REGISTER_LPG_POWERED,
    equipmentType: ApplicationTypeEnum.LPG_POWERED,
    parentId: MainApplicationCategory.REGISTER,
    icon: 'naturalGas',
  },
  {
    id: 49,
    title: 'Yuk ko‘targichni ro‘yxatga olish',
    name: 'Yuk ko‘targich',
    description: 'Yuk ko‘targichni ro‘yxatga olish ariza shakli',
    category: ApplicationCategory.EQUIPMENTS,
    type: ApplicationTypeEnum.REGISTER_HOIST,
    equipmentType: ApplicationTypeEnum.HOIST,
    parentId: MainApplicationCategory.REGISTER,
    icon: 'heavyLift',
  },
  {
    id: 50,
    title: 'Osma arqonli yuruvchi yo‘lni ro‘yxatga olish',
    name: 'Osma arqonli yuruvchi yo‘l',
    description: 'Osma arqonli yuruvchi yo‘lni ro‘yxatga olish ariza shakli',
    category: ApplicationCategory.EQUIPMENTS,
    type: ApplicationTypeEnum.REGISTER_CABLEWAY,
    equipmentType: ApplicationTypeEnum.CABLEWAY,
    parentId: MainApplicationCategory.REGISTER,
    icon: 'cableway',
  },
  {
    id: 130,
    title: 'Neft mahsulotlar saqlovchi idishni ro‘yxatga olish',
    name: 'Neft mahsulotlar saqlovchi idish',
    description: 'Neft mahsulotlar saqlovchi idishni ro‘yxatga olish ariza shakli',
    category: ApplicationCategory.EQUIPMENTS,
    type: ApplicationTypeEnum.REGISTER_OIL_CONTAINER,
    equipmentType: ApplicationTypeEnum.OIL_CONTAINER,
    parentId: MainApplicationCategory.REGISTER,
    icon: 'oilBarrel',
  },
  {
    id: 1,
    title: 'XICHOni ro‘yxatga olish',
    description: 'XICHOni ro‘yxatga olish ariza shakli',
    category: ApplicationCategory.HF,
    type: ApplicationTypeEnum.REGISTER_HF,
    icon: 'factoryRegisterIcon',
  },
  {
    id: 3,
    title: 'XICHOni ro‘yxatdan chiqarish',
    description: 'XICHOni ro‘yxatdan chiqarish ariza shakli',
    category: ApplicationCategory.HF,
    type: ApplicationTypeEnum.DEREGISTER_HF,
    icon: 'factoryDeregisterIcon',
  },
  {
    id: 65,
    title: 'Kranni ro‘yxatga olish arizasi',
    name: 'Kran',
    description: 'Kranni ro‘yxatga olish arizasi',
    category: ApplicationCategory.ILLEGAL_EQUIPMENTS,
    type: ApplicationTypeEnum.ILLEGAL_REGISTER_CRANE,
    icon: 'crane',
  },
  {
    id: 66,
    title: 'Bosim ostida ishlovchi idishni ro‘yxatga olish',
    name: 'Bosim ostida ishlovchi idish',
    description: 'Bosim ostida ishlovchi idishni ro‘yxatga olish',
    category: ApplicationCategory.ILLEGAL_EQUIPMENTS,
    type: ApplicationTypeEnum.ILLEGAL_REGISTER_CONTAINER,
    icon: 'pressureVessel',
  },
  {
    id: 67,
    title: 'Bug‘ qozonni ro‘yxatga olish',
    name: 'Bug‘ qozon',
    description: 'Bug‘ qozonni ro‘yxatga olish',
    category: ApplicationCategory.ILLEGAL_EQUIPMENTS,
    type: ApplicationTypeEnum.ILLEGAL_REGISTER_BOILER,
    icon: 'boiler',
  },
  {
    id: 69,
    title: 'Eskalatorni ro‘yxatga olish',
    name: 'Eskalator',
    description: 'Eskalatorni ro‘yxatga olish',
    category: ApplicationCategory.ILLEGAL_EQUIPMENTS,
    type: ApplicationTypeEnum.ILLEGAL_REGISTER_ESCALATOR,
    icon: 'escalator',
  },
  {
    id: 70,
    title: 'Attraksion ro‘yxatga olish',
    name: 'Attraksion pasporti',
    description: 'Attraksion ro‘yxatga olish',
    category: ApplicationCategory.ILLEGAL_EQUIPMENTS,
    type: ApplicationTypeEnum.ILLEGAL_REGISTER_ATTRACTION,
    icon: 'passport',
    disabled: true,
  },
  {
    id: 71,
    title: 'Quvurlarni ro‘yxatga olish ariza shakli',
    name: 'Quvur',
    description: 'Quvurlarni ro‘yxatga olish ariza shakli',
    category: ApplicationCategory.ILLEGAL_EQUIPMENTS,
    type: ApplicationTypeEnum.ILLEGAL_REGISTER_PIPELINE,
    icon: 'pipeSystem',
  },
  {
    id: 72,
    title: 'Bosim ostida ishlovchi idishlarni (kimyo) ro‘yxatga olish',
    name: 'Bosim ostida ishlovchi idish (kimyo)',
    description: 'Bosim ostida ishlovchi idishlarni (kimyo) ro‘yxatga olish',
    category: ApplicationCategory.ILLEGAL_EQUIPMENTS,
    type: ApplicationTypeEnum.ILLEGAL_REGISTER_CHEMICAL_CONTAINER,
    icon: 'chemicalVessel',
  },
  {
    id: 73,
    title: 'Bug‘ va issiq suv quvurlarini ro‘yxatga olish',
    name: 'Bug‘ va issiq suv quvuri',
    description: 'Bug‘ va issiq suv quvurlarini ro‘yxatga olish',
    category: ApplicationCategory.ILLEGAL_EQUIPMENTS,
    type: ApplicationTypeEnum.ILLEGAL_REGISTER_HEAT_PIPELINE,
    icon: 'steamPipe',
  },
  {
    id: 74,
    title: 'Qozon utilizatorlarini ro‘yxatga olish',
    name: 'Qozon utilizatorlarini',
    description: 'Qozon utilizatorlarini ro‘yxatga olish',
    category: ApplicationCategory.ILLEGAL_EQUIPMENTS,
    type: ApplicationTypeEnum.ILLEGAL_REGISTER_BOILER_UTILIZER,
    icon: 'recycleBoiler',
  },
  {
    id: 75,
    title: 'Bosim ostida ishlovchi idishlarni (SUG) ro‘yxatga olish',
    name: 'Bosim ostida ishlovchi idishlarni (SUG)',
    description: 'Bosim ostida ishlovchi idishlarni (SUG) ro‘yxatga olish',
    category: ApplicationCategory.ILLEGAL_EQUIPMENTS,
    type: ApplicationTypeEnum.ILLEGAL_REGISTER_LPG_CONTAINER,
    icon: 'gasVessel',
  },
  {
    id: 76,
    title: 'Yiliga 100 ming va undan ortiq kubometr tabiiy gazdan foydalanuvchi qurilmalarni ro‘yxatga olish',
    name: 'Yiliga 100 ming va undan ortiq kubometr tabiiy gazdan foydalanuvchi qurilma',
    description: 'Yiliga 100 ming va undan ortiq kubometr tabiiy gazdan foydalanuvchi qurilmalarni ro‘yxatga olish',
    category: ApplicationCategory.ILLEGAL_EQUIPMENTS,
    type: ApplicationTypeEnum.ILLEGAL_REGISTER_LPG_POWERED,
    icon: 'naturalGas',
  },
  {
    id: 77,
    title: 'Yuk ko‘targichni ro‘yxatga olish',
    name: 'Yuk ko‘targichni ro‘yxatga olish',
    description: 'Yiliga Yuk ko‘targichni ro‘yxatga olish',
    category: ApplicationCategory.ILLEGAL_EQUIPMENTS,
    type: ApplicationTypeEnum.ILLEGAL_REGISTER_HOIST,
    icon: 'heavyLift',
  },
  {
    id: 78,
    title: 'Osma arqonli yuruvchi yo‘lni ro‘yxatga olish',
    name: 'Osma arqonli yuruvchi yo‘lni ro‘yxatga olish',
    description: 'Osma arqonli yuruvchi yo‘lni ro‘yxatga olish',
    category: ApplicationCategory.ILLEGAL_EQUIPMENTS,
    type: ApplicationTypeEnum.ILLEGAL_REGISTER_CABLEWAY,
    icon: 'cableway',
  },
  {
    id: 131,
    title: 'Neft mahsulotlar saqlovchi idishni ro‘yxatga olish',
    name: 'Neft mahsulotlar saqlovchi idishni ro‘yxatga olish',
    description: 'Neft mahsulotlar saqlovchi idishni ro‘yxatga olish',
    category: ApplicationCategory.ILLEGAL_EQUIPMENTS,
    type: ApplicationTypeEnum.ILLEGAL_REGISTER_OIL_CONTAINER,
    icon: 'oilBarrel',
  },
  {
    id: 2,
    title: 'XICHOni ro‘yxatga olish',
    description: 'XICHOni ro‘yxatga olish ariza shakli',
    category: ApplicationCategory.ILLEGAL_HF,
    type: ApplicationTypeEnum.ILLEGAL_REGISTER_HF,
    icon: 'factoryRegisterIcon',
    disabled: true,
  },
  {
    id: 54,
    title: 'Rentgenni ro‘yxatga olish',
    description: 'Rentgenni ro‘yxatga olish ariza shakli',
    category: ApplicationCategory.XRAY,
    type: ApplicationTypeEnum.REGISTER_XRAY,
    icon: 'radiationRegisterIcon',
  },
  {
    id: 55,
    title: 'Rentgenni ro‘yxatga olish',
    description: 'Rentgenni ro‘yxatga olish ariza shakli',
    category: ApplicationCategory.ILLEGAL_XRAY,
    type: ApplicationTypeEnum.ILLEGAL_REGISTER_XRAY,
    icon: 'radiationRegisterIcon',
  },
  {
    id: 51,
    title: 'Ionlashtiruvchi nurlanish manbalarini ro‘yxatga olish',
    description: 'Ionlashtiruvchi nurlanish manbalarini ro‘yxatga olish ariza shakli',
    category: ApplicationCategory.IRS,
    type: ApplicationTypeEnum.REGISTER_IRS,
    icon: 'radiationRegisterIcon',
  },
  {
    id: 52,
    title: 'Ionlashtiruvchi nurlanish manbalarini ro‘yxatga olish',
    description: 'Ionlashtiruvchi nurlanish manbalarini ro‘yxatga olish ariza shakli',
    category: ApplicationCategory.ILLEGAL_IRS,
    type: ApplicationTypeEnum.ILLEGAL_REGISTER_IRS,
    icon: 'radiationReceiveIcon',
  },

  {
    id: 140,
    title: 'Akkreditatsiyadan o‘tkazish',
    name: 'Akkreditatsiya',
    description: 'Ekspert tashkilotini akkreditatsiyadan o‘tkazish ariza shakli',
    category: ApplicationCategory.ACCREDITATION,
    type: ApplicationTypeEnum.ACCREDIT_EXPERT,
    icon: 'expertOrgAccreditationIcon',
  },
  {
    id: 141,
    title: 'Qayta akkreditatsiyadan o‘tkazish',
    name: 'Akkreditatsiya',
    description: 'Ekspert tashkilotini qayta akkreditatsiyadan o‘tkazish ariza shakli',
    category: ApplicationCategory.ACCREDITATION,
    type: ApplicationTypeEnum.RE_ACCREDIT_EXPERT,
    icon: 'expertOrgAccreditationIcon',
  },
  {
    id: 142,
    title: 'Akkreditatsiya sohasini kengaytirish va qisqartirish',
    name: 'Akkreditatsiya',
    description: 'Ekspert tashkilotining akkreditatsiya sohasini kengaytirish va qisqartirish ariza shakli',
    category: ApplicationCategory.ACCREDITATION,
    type: ApplicationTypeEnum.EXPEND_ACCREDITATION_SCOPE,
    icon: 'expertOrgAccreditationIcon',
  },
  {
    id: 40,
    title: 'Liftni ro‘yxatga olish',
    name: 'Lift',
    description: 'Liftni ro‘yxatga olish ariza shakli',
    type: ApplicationTypeEnum.REGISTER_ELEVATOR,
    icon: 'elevator',
  },
  {
    id: 107,
    title: 'Liftni ro‘yxatdan chiqarish',
    name: 'Lift',
    description: 'Liftni ro‘yxatdan chiqarish ariza shakli',
    type: ApplicationTypeEnum.DEREGISTER_ELEVATOR,
    icon: 'elevator',
  },
  {
    id: 108,
    title: 'Liftni qayta ro‘yxatga olish',
    name: 'Lift',
    description: 'Liftni qayta ro‘yxatga olish ariza shakli',
    type: ApplicationTypeEnum.RE_REGISTER_ELEVATOR,
    icon: 'elevator',
  },
  {
    id: 143,
    title: 'Akkreditatsiya attestatini qayta rasmiylashtirish',
    name: 'Akkreditatsiya',
    description: 'Akkreditatsiya attestatini qayta rasmiylashtirish ariza shakli',
    type: ApplicationTypeEnum.RE_ISSUE_ACCREDITATION_CERT,
    icon: 'expertOrgAccreditationIcon',
  },
]

export const applicationsList = [
  // HF (XICHO)
  {
    id: 1,
    title: 'XICHOni ro‘yxatga olish',
    type: ApplicationTypeEnum.REGISTER_HF,
  },
  {
    id: 3,
    title: 'XICHOni ro‘yxatdan chiqarish',
    type: ApplicationTypeEnum.DEREGISTER_HF,
  },

  // EQUIPMENT (Qurilmalar)
  // Crane
  {
    id: 37,
    title: 'Kranni ro‘yxatga olish',
    type: ApplicationTypeEnum.REGISTER_CRANE,
  },
  {
    id: 101,
    title: 'Kranni ro‘yxatdan chiqarish',
    type: ApplicationTypeEnum.DEREGISTER_CRANE,
  },
  {
    id: 102,
    title: 'Kranni qayta ro‘yxatga olish',
    type: ApplicationTypeEnum.RE_REGISTER_CRANE,
  },

  // Container
  {
    id: 38,
    title: 'Bosim ostida ishlovchi idishni ro‘yxatga olish',
    type: ApplicationTypeEnum.REGISTER_CONTAINER,
  },
  {
    id: 103,
    title: 'Bosim ostida ishlovchi idishni ro‘yxatdan chiqarish',
    type: ApplicationTypeEnum.DEREGISTER_CONTAINER,
  },
  {
    id: 104,
    title: 'Bosim ostida ishlovchi idishni qayta ro‘yxatga olish',
    type: ApplicationTypeEnum.RE_REGISTER_CONTAINER,
  },

  // Boiler
  {
    id: 39,
    title: 'Bug‘ qozonni ro‘yxatga olish',
    type: ApplicationTypeEnum.REGISTER_BOILER,
  },
  {
    id: 105,
    title: 'Bug‘ qozonni ro‘yxatdan chiqarish',
    type: ApplicationTypeEnum.DEREGISTER_BOILER,
  },
  {
    id: 106,
    title: 'Bug‘ qozonni qayta ro‘yxatga olish',
    type: ApplicationTypeEnum.RE_REGISTER_BOILER,
  },

  // Escalator
  {
    id: 41,
    title: 'Eskalatorni ro‘yxatga olish',
    type: ApplicationTypeEnum.REGISTER_ESCALATOR,
  },
  {
    id: 109,
    title: 'Eskalatorni ro‘yxatdan chiqarish',
    type: ApplicationTypeEnum.DEREGISTER_ESCALATOR,
  },
  {
    id: 110,
    title: 'Eskalatorni qayta ro‘yxatga olish',
    type: ApplicationTypeEnum.RE_REGISTER_ESCALATOR,
  },

  // Attraction
  {
    id: 42,
    title: 'Attraksionni ro‘yxatga olish',
    type: ApplicationTypeEnum.REGISTER_ATTRACTION,
  },
  {
    id: 111,
    title: 'Attraksionni ro‘yxatdan chiqarish',
    type: ApplicationTypeEnum.DEREGISTER_ATTRACTION,
  },
  {
    id: 112,
    title: 'Attraksionni qayta ro‘yxatga olish',
    type: ApplicationTypeEnum.RE_REGISTER_ATTRACTION,
  },

  // Pipeline
  {
    id: 43,
    title: 'Quvurni ro‘yxatga olish',
    type: ApplicationTypeEnum.REGISTER_PIPELINE,
  },
  {
    id: 113,
    title: 'Quvurni ro‘yxatdan chiqarish',
    type: ApplicationTypeEnum.DEREGISTER_PIPELINE,
  },
  {
    id: 114,
    title: 'Quvurni qayta ro‘yxatga olish',
    type: ApplicationTypeEnum.RE_REGISTER_PIPELINE,
  },

  // Chemical Container
  {
    id: 44,
    title: 'Bosim ostida ishlovchi idishlarni (kimyo) ro‘yxatga olish',
    type: ApplicationTypeEnum.REGISTER_CHEMICAL_CONTAINER,
  },
  {
    id: 115,
    title: 'Bosim ostida ishlovchi idishni (kimyo) ro‘yxatdan chiqarish',
    type: ApplicationTypeEnum.DEREGISTER_CHEMICAL_CONTAINER,
  },
  {
    id: 116,
    title: 'Bosim ostida ishlovchi idishni (kimyo) qayta ro‘yxatga olish',
    type: ApplicationTypeEnum.RE_REGISTER_CHEMICAL_CONTAINER,
  },

  // Heat Pipeline
  {
    id: 45,
    title: 'Bug‘ va issiq suv quvurlarini ro‘yxatga olish',
    type: ApplicationTypeEnum.REGISTER_HEAT_PIPELINE,
  },
  {
    id: 117,
    title: 'Bug‘ va issiq suv quvurini ro‘yxatdan chiqarish',
    type: ApplicationTypeEnum.DEREGISTER_HEAT_PIPELINE,
  },
  {
    id: 118,
    title: 'Bug‘ va issiq suv quvurini qayta ro‘yxatga olish',
    type: ApplicationTypeEnum.RE_REGISTER_HEAT_PIPELINE,
  },
  // Boiler Utilizer
  {
    id: 46,
    title: 'Qozon utilizatorlarini ro‘yxatga olish',
    type: ApplicationTypeEnum.REGISTER_BOILER_UTILIZER,
  },
  {
    id: 119,
    title: 'Qozon utilizatorini ro‘yxatdan chiqarish',
    type: ApplicationTypeEnum.DEREGISTER_BOILER_UTILIZER,
  },
  {
    id: 120,
    title: 'Qozon utilizatorini qayta ro‘yxatga olish',
    type: ApplicationTypeEnum.RE_REGISTER_BOILER_UTILIZER,
  },
  // LPG Container
  {
    id: 47,
    title: 'Bosim ostida ishlovchi idishlarni (SUG) ro‘yxatga olish',
    type: ApplicationTypeEnum.REGISTER_LPG_CONTAINER,
  },
  {
    id: 121,
    title: 'Bosim ostida ishlovchi idishni (SUG) ro‘yxatdan chiqarish',
    type: ApplicationTypeEnum.DEREGISTER_LPG_CONTAINER,
  },
  {
    id: 122,
    title: 'Bosim ostida ishlovchi idishni (SUG) qayta ro‘yxatga olish',
    type: ApplicationTypeEnum.RE_REGISTER_LPG_CONTAINER,
  },
  // LPG Powered
  {
    id: 48,
    title: 'Yiliga 100 ming va undan ortiq kubometr tabiiy gazdan foydalanuvchi qurilmalarni ro‘yxatga olish',
    type: ApplicationTypeEnum.REGISTER_LPG_POWERED,
  },
  {
    id: 123,
    title: 'Yiliga 100 ming va undan ortiq kubometr tabiiy gazdan foydalanuvchi qurilmani ro‘yxatdan chiqarish',
    type: ApplicationTypeEnum.DEREGISTER_LPG_POWERED,
  },
  {
    id: 124,
    title: 'Yiliga 100 ming va undan ortiq kubometr tabiiy gazdan foydalanuvchi qurilmani qayta ro‘yxatga olish',
    type: ApplicationTypeEnum.RE_REGISTER_LPG_POWERED,
  },
  // Hoist
  {
    id: 49,
    title: 'Yuk ko‘targichni ro‘yxatga olish',
    type: ApplicationTypeEnum.REGISTER_HOIST,
  },
  {
    id: 125,
    title: 'Yuk ko‘targichni ro‘yxatdan chiqarish',
    type: ApplicationTypeEnum.DEREGISTER_HOIST,
  },
  {
    id: 126,
    title: 'Yuk ko‘targichni qayta ro‘yxatga olish',
    type: ApplicationTypeEnum.RE_REGISTER_HOIST,
  },
  // Cableway
  {
    id: 50,
    title: 'Osma arqonli yuruvchi yo‘lni ro‘yxatga olish',
    type: ApplicationTypeEnum.REGISTER_CABLEWAY,
  },
  {
    id: 127,
    title: 'Osma arqonli yuruvchi yo‘lni ro‘yxatdan chiqarish',
    type: ApplicationTypeEnum.DEREGISTER_CABLEWAY,
  },
  {
    id: 128,
    title: 'Osma arqonli yuruvchi yo‘lni qayta ro‘yxatga olish',
    type: ApplicationTypeEnum.RE_REGISTER_CABLEWAY,
  },

  // IRS
  {
    id: 51,
    title: 'Ionlashtiruvchi nurlanish manbalarini ro‘yxatga olish',
    type: ApplicationTypeEnum.REGISTER_IRS,
  },

  // OIL CONTAINER
  {
    id: 132,
    title: 'Neft mahsulotlar saqlovchi idishni ro‘yxatga olish',
    type: ApplicationTypeEnum.REGISTER_OIL_CONTAINER,
  },
  {
    id: 133,
    title: 'Neft mahsulotlar saqlovchi idishni ro‘yxatdan chiqarish',
    type: ApplicationTypeEnum.DEREGISTER_OIL_CONTAINER,
  },
  {
    id: 134,
    title: 'Neft mahsulotlar saqlovchi idishni qayta ro‘yxatga olish',
    type: ApplicationTypeEnum.RE_REGISTER_OIL_CONTAINER,
  },

  // XRAY
  {
    id: 54,
    title: 'Rentgenni ro‘yxatga olish',
    type: ApplicationTypeEnum.REGISTER_XRAY,
  },

  // ELEVATOR (eski arizalar — yangi ariza yaratilmaydi)
  {
    id: 40,
    title: 'Liftni ro‘yxatga olish',
    type: ApplicationTypeEnum.REGISTER_ELEVATOR,
  },
  {
    id: 107,
    title: 'Liftni ro‘yxatdan chiqarish',
    type: ApplicationTypeEnum.DEREGISTER_ELEVATOR,
  },
  {
    id: 108,
    title: 'Liftni qayta ro‘yxatga olish',
    type: ApplicationTypeEnum.RE_REGISTER_ELEVATOR,
  },

  // ACCREDITATION
  {
    id: 140,
    title: 'Akkreditatsiyadan o‘tkazish',
    type: ApplicationTypeEnum.ACCREDIT_EXPERT,
  },
  {
    id: 141,
    title: 'Qayta akkreditatsiyadan o‘tkazish',
    type: ApplicationTypeEnum.RE_ACCREDIT_EXPERT,
  },
  {
    id: 142,
    title: 'Akkreditatsiya sohasini kengaytirish va qisqartirish',
    type: ApplicationTypeEnum.EXPEND_ACCREDITATION_SCOPE,
  },
  {
    id: 143,
    title: 'Akkreditatsiya attestatini qayta rasmiylashtirish',
    type: ApplicationTypeEnum.RE_ISSUE_ACCREDITATION_CERT,
  },
  // Java shu turlarni ham yuborishi mumkin, lekin ular arizalar ro'yxatida
  // uchramaydi: nomi kerak, filtrda esa ortiqcha
  {
    id: 200,
    title: 'XICHO ma’lumotlarini o‘zgartirish',
    filterable: false,
    type: ApplicationTypeEnum.MODIFY_HF,
  },
  {
    id: 203,
    title: 'Ekspertiza xulosasini ro‘yxatga olish',
    filterable: false,
    type: ApplicationTypeEnum.REGISTER_EXPERTISE_CONCLUSION,
  },
  {
    id: 204,
    title: 'Kadastr pasportini ro‘yxatga olish',
    filterable: false,
    type: ApplicationTypeEnum.REGISTER_CADASTRE_PASSPORT,
  },
  {
    id: 205,
    title: 'INMni qabul qilish',
    filterable: false,
    type: ApplicationTypeEnum.ACCEPT_IRS,
  },
  {
    id: 206,
    title: 'INMni o‘tkazish',
    filterable: false,
    type: ApplicationTypeEnum.TRANSFER_IRS,
  },
  {
    id: 207,
    title: 'Attestatsiya (qo‘mita)',
    filterable: false,
    type: ApplicationTypeEnum.ATTESTATION_COMMITTEE,
  },
  {
    id: 208,
    title: 'Attestatsiya (hududiy boshqarma)',
    filterable: false,
    type: ApplicationTypeEnum.ATTESTATION_REGIONAL,
  },
  {
    id: 209,
    title: 'Deklaratsiyani ko‘rib chiqish',
    filterable: false,
    type: ApplicationTypeEnum.CHECK_DECLARATION,
  },
]
