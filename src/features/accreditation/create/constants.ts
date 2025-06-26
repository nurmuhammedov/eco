import { ApplicationCardItem, ApplicationCategory, ApplicationTypeEnum } from '@/entities/create-application';

export const accreditationCards: ApplicationCardItem[] = [
  {
    id: 1,
    title: "Ekspert tashkilotini akkreditatsiyadan o'tkazish",
    description: "Ekspert tashkilotini akkreditatsiyadan o'tkazish uchun ariza",
    category: ApplicationCategory.ACCREDITATION,
    type: ApplicationTypeEnum.REGISTER_ACCREDITATION,
    icon: 'expertOrgExpandAccreditationIcon',
  },
  {
    id: 2,
    title: "Ekspert tashkilotini qayta akkreditatsiyadan o'tkazish",
    description: "Ekspert tashkilotini qayta akkreditatsiyadan o'tkazish uchun ariza",
    category: ApplicationCategory.ACCREDITATION,
    type: ApplicationTypeEnum.RE_REGISTER_ACCREDITATION,
    icon: 'expertOrgExpandAccreditationIcon',
  },
  {
    id: 3,
    title: 'Ekspert tashkilotining akkreditatsiya sohasini kengaytirish',
    description: 'Ekspert tashkilotining akkreditatsiya sohasini kengaytirish uchun ariza',
    category: ApplicationCategory.ACCREDITATION,
    type: ApplicationTypeEnum.EXPAND_ACCREDITATION,
    icon: 'expertOrgExpandAccreditationIcon',
  },
];
