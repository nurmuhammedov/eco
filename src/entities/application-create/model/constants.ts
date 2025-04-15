import { ApplicationCardItem, ApplicationCategory } from '@/entities/application-create';
import { ApplicationTypeEnum } from '@/entities/user/applications/create-application/model/application.types';

export const APPLICATION_CATEGORIES = [
  {
    id: ApplicationCategory.XICHO,
    name: 'XICHO',
  },
  {
    id: ApplicationCategory.HOKQ,
    name: 'Хавфли объектлар ва қурилмалар',
  },
  {
    id: ApplicationCategory.INM,
    name: 'ИНМ',
  },
  {
    id: ApplicationCategory.ACCREDITATION,
    name: 'Аккредитация',
  },
  {
    id: ApplicationCategory.ATTESTATION_PREVENTION,
    name: 'Аттестация ва профилактика',
  },
  {
    id: ApplicationCategory.CADASTRE,
    name: 'Кадастр',
  },
];

export const APPLICATIONS_DATA: ApplicationCardItem[] = [
  // {
  //   id: 1,
  //   title: 'Хавфли объект ва қурилмаларни рўйхатга олиш',
  //   description: 'Хавфли объектларни давлат рўйхатига киритиш учун ариза',
  //   type: ApplicationTypeEnum.RegisterHPO,
  //   icon: 'documentAdd',
  //   isHighlighted: true,
  // },
  // {
  //   id: 2,
  //   title: 'Хавфли объект ва қурилмаларни рўйхатдан чиқариш',
  //   description: 'Объектларни рўйхатдан чиқариш учун ариза',
  //   type: CategoryId.REGISTRATION,
  //   icon: 'documentRemove',
  // },
  // {
  //   id: 3,
  //   title: 'Хавфли объект ва қурилмаларни қайта рўйхатдан ўтказиш',
  //   description: 'Объектларни қайта рўйхатдан ўтказиш учун ариза',
  //   type: CategoryId.REGISTRATION,
  //   icon: 'documentRefresh',
  // },
  {
    id: 4,
    title: 'Босим остида ишловчи идишни рўйхатга олиш',
    description: 'Босим остида ишлайдиган идишларни рўйхатга олиш',
    category: ApplicationCategory.HOKQ,
    type: ApplicationTypeEnum.RegisterPressureVesselLPG,
    icon: 'pressureVessel',
  },
  {
    id: 5,
    title: 'Буғқозонни рўйхатга олиш',
    description: 'Буғ қозонларини рўйхатга олиш учун ариза',
    category: ApplicationCategory.HOKQ,
    type: ApplicationTypeEnum.RegisterSteamAndHotWaterPipeline,
    icon: 'boiler',
  },
  {
    id: 6,
    title: 'Лифтни рўйхатга олиш',
    description: 'Лифт қурилмаларини рўйхатга олиш учун ариза',
    category: ApplicationCategory.HOKQ,
    type: ApplicationTypeEnum.RegisterLift,
    icon: 'elevator',
  },
  {
    id: 7,
    title: 'Эскалаторни рўйхатга олиш',
    description: 'Эскалатор қурилмаларини рўйхатга олиш',
    category: ApplicationCategory.HOKQ,
    type: ApplicationTypeEnum.RegisterEscalator,
    icon: 'escalator',
  },
  {
    id: 8,
    title: 'Аттракцион паспортини рўйхатга олиш',
    description: 'Аттракцион паспортларини расмийлаштириш',
    category: ApplicationCategory.HOKQ,
    type: ApplicationTypeEnum.RegisterAttractionPassport,
    icon: 'passport',
  },
  {
    id: 9,
    title: 'Аттракционни рўйхатга олиш',
    description: 'Аттракцион қурилмаларини рўйхатга олиш',
    category: ApplicationCategory.HOKQ,
    type: ApplicationTypeEnum.RegisterAttraction,
    icon: 'attraction',
  },
  {
    id: 10,
    title: 'Кранни рўйхатга олиш',
    description: 'Кран қурилмаларини рўйхатга олиш',
    category: ApplicationCategory.HOKQ,
    type: ApplicationTypeEnum.RegisterCrane,
    icon: 'crane',
  },
  {
    id: 11,
    title: 'Қувурни рўйхатга олиш',
    description: 'Қувурларни рўйхатга олиш учун ариза',
    category: ApplicationCategory.HOKQ,
    type: ApplicationTypeEnum.RegisterPipeline,
    icon: 'pipeSystem',
  },
];
