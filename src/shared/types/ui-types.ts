export enum UIModeEnum {
  EDIT = 'edit',
  VIEW = 'view',
  DELETE = 'delete',
  CREATE = 'create',
}

export const UI_COMPONENTS = {
  REGION_DRAWER: 'region-drawer', // Viloyatlar
  DISTRICT_DRAWER: 'regions-drawer', // Tumanlar
  TEMPLATE_DRAWER: 'template-drawer', // Shablonlar
  EQUIPMENT_DRAWER: 'equipment-drawer', // Qurilmaning quyi turlari
  CENTRAL_APPARATUS_DRAWER: 'central-apparatus', // Markaziy apparat
  TERRITORIAL_DEPARTMENTS_DRAWER: 'territorial-departments', // Hududiy bo'limlar
  COMMITTEE_STAFFS_DRAWER: 'committee-staffs', // Qo'mita xodimlari
  TERRITORIAL_STAFFS_DRAWER: 'territorial-staffs', // Hududiy bo'lim xodimlari
  HAZARDOUS_FACILITY_TYPE_DRAWER: 'hazardous-facility-type', // Xavfli ishlab chiqarish obyektlari turlari
  ATTRACTION_TYPE_DRAWER: 'attraction-type-drawer',
} as const;

export type UIComponentName = (typeof UI_COMPONENTS)[keyof typeof UI_COMPONENTS];

export interface UIState<T = unknown> {
  isOpen: boolean;
  mode: UIModeEnum | undefined;
  componentName: UIComponentName | undefined;
  data: T | null;
}

export interface UIComponentDataMap {
  [UI_COMPONENTS.REGION_DRAWER]: {
    id: number;
  };
  [UI_COMPONENTS.DISTRICT_DRAWER]: {
    id: number;
  };
  [UI_COMPONENTS.CENTRAL_APPARATUS_DRAWER]: {
    id: number;
  };
  [UI_COMPONENTS.TERRITORIAL_DEPARTMENTS_DRAWER]: {
    id: number;
  };
  [UI_COMPONENTS.COMMITTEE_STAFFS_DRAWER]: {
    id: string;
  };
  [UI_COMPONENTS.TERRITORIAL_STAFFS_DRAWER]: {
    id: string;
  };
  [UI_COMPONENTS.HAZARDOUS_FACILITY_TYPE_DRAWER]: {
    id: number;
  };
  [UI_COMPONENTS.TEMPLATE_DRAWER]: {
    id: number;
  };
  [UI_COMPONENTS.EQUIPMENT_DRAWER]: {
    id: number;
  };
  [UI_COMPONENTS.ATTRACTION_TYPE_DRAWER]: {
    id: number;
  };
}

export type PayloadUI<T extends UIComponentName> = {
  mode: UIModeEnum;
  componentName: T;
  data?: UIComponentDataMap[T] | null;
};
