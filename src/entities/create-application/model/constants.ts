import { ApplicationCardItem, ApplicationCategory } from '@/entities/create-application';
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

export const MAIN_APPLICATION_BY_CATEGORY = {
  [ApplicationCategory.HOKQ]: [
    {
      id: 'register',
      title: 'Хавфли объект ва қурилмаларни рўйхатга олиш',
      description: 'Хавфли объектларни давлат рўйхатига киритиш учун ариза',
      icon: 'documentAdd',
    },
    {
      id: 'unregister',
      title: 'Хавфли объект ва қурилмаларни рўйхатдан чиқариш',
      description: 'Объектларни рўйхатдан чиқариш учун ариза',
      icon: 'documentRemove',
    },
    {
      id: 'reregister',
      title: 'Хавфли объект ва қурилмаларни қайта рўйхатдан ўтказиш',
      description: 'Объектларни қайта рўйхатдан ўтказиш учун ариза',
      icon: 'documentRefresh',
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
    id: 10,
    title: 'Кранни рўйхатга олиш',
    description: 'Кран қурилмаларини рўйхатга олиш учун ариза',
    category: ApplicationCategory.HOKQ,
    type: ApplicationTypeEnum.RegisterCrane,
    icon: 'crane',
  },
  {
    id: 4,
    title: 'Босим остида ишловчи идишни рўйхатга олиш',
    description: 'Босим остида ишлайдиган идишларни рўйхатга олиш учун ариза',
    category: ApplicationCategory.HOKQ,
    type: ApplicationTypeEnum.RegisterVessel,
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
    description: 'Эскалатор қурилмаларини рўйхатга олиш учун ариза',
    category: ApplicationCategory.HOKQ,
    type: ApplicationTypeEnum.RegisterEscalator,
    icon: 'escalator',
  },
  {
    id: 8,
    title: 'Аттракцион паспортини рўйхатга олиш',
    description: 'Аттракцион паспортларини расмийлаштириш учун ариза',
    category: ApplicationCategory.HOKQ,
    type: ApplicationTypeEnum.RegisterAttractionPassport,
    icon: 'passport',
  },
  {
    id: 9,
    title: 'Аттракционни рўйхатга олиш',
    description: 'Аттракцион қурилмаларини рўйхатга олиш учун ариза',
    category: ApplicationCategory.HOKQ,
    type: ApplicationTypeEnum.RegisterAttraction,
    icon: 'attraction',
  },
  {
    id: 11,
    title: 'Қувурни рўйхатга олиш',
    description: 'Қувурларни рўйхатга олиш учун ариза',
    category: ApplicationCategory.HOKQ,
    type: ApplicationTypeEnum.RegisterPipeline,
    icon: 'pipeSystem',
  },
  {
    id: 12,
    title: 'Босим остида ишловчи идишларни (кимё) рўйхатга олиш',
    description: 'Босим остида ишловчи идишларни (кимё) рўйхатга олиш учун ариза',
    category: ApplicationCategory.HOKQ,
    type: ApplicationTypeEnum.RegisterPressureVesselChemical,
    icon: 'chemicalVessel',
  },
  {
    id: 13,
    title: 'Буғ ва иссиқ сув қувурларини рўйхатга олиш',
    description: 'Буғ ва иссиқ сув қувурларини рўйхатга олиш учун ариза',
    category: ApplicationCategory.HOKQ,
    type: ApplicationTypeEnum.RegisterSteamAndHotWaterPipeline,
    icon: 'steamPipe',
  },
  {
    id: 14,
    title: 'Қозон утилизаторларини рўйхатга олиш',
    description: 'Қозон утилизаторларини рўйхатга олиш учун ариза',
    category: ApplicationCategory.HOKQ,
    type: ApplicationTypeEnum.RegisterBoilerUtilizer,
    icon: 'recycleBoiler',
  },
  {
    id: 15,
    title: 'Босим остида ишловчи идишларни (СУГ) рўйхатга олиш',
    description: 'Босим остида ишловчи идишларни (СУГ) рўйхатга олиш учун ариза',
    category: ApplicationCategory.HOKQ,
    type: ApplicationTypeEnum.RegisterPressureVesselLPG,
    icon: 'gasVessel',
  },
  {
    id: 16,
    title: 'Йилига 100 минг ва ундан ортиқ кубометр табиий газдан фойдаланувчи қурилмаларни рўйхатга олиш',
    description:
      'Йилига 100 минг ва ундан ортиқ кубометр табиий газдан фойдаланувчи қурилмаларни рўйхатга олиш учун ариза',
    category: ApplicationCategory.HOKQ,
    type: ApplicationTypeEnum.RegisterHighGasUsageEquipment,
    icon: 'naturalGas',
  },
  {
    id: 17,
    title: 'Юк кўтаргични рўйхатга олиш',
    description: 'Юк кўтаргични рўйхатга олиш учун ариза',
    category: ApplicationCategory.HOKQ,
    type: ApplicationTypeEnum.RegisterElevator,
    icon: 'heavyLift',
  },
  {
    id: 18,
    title: 'Осма арқонли юрувчи йўлни рўйхатга олиш',
    description: 'Осма арқонли юрувчи йўлни рўйхатга олиш учун ариза',
    category: ApplicationCategory.HOKQ,
    type: ApplicationTypeEnum.RegisterBridgeOrRoad,
    icon: 'cableway',
  },
];
