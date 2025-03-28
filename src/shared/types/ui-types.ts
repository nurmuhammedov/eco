export enum UIModeEnum {
  CREATE = 'create',
  EDIT = 'edit',
  VIEW = 'view',
  DELETE = 'delete',
}

export const UI_COMPONENTS = {
  REGION_DRAWER: 'region-drawer',
  DISTRICT_DRAWER: 'regions-drawer',
  CENTRAL_APPARATUS_DRAWER: 'central-apparatus',
  TERRITORIAL_DEPARTMENTS_DRAWER: 'territorial-departments',
} as const;

export type UIComponentName =
  (typeof UI_COMPONENTS)[keyof typeof UI_COMPONENTS];

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
}

export type PayloadUI<T extends UIComponentName> = {
  mode: UIModeEnum;
  componentName: T;
  data?: UIComponentDataMap[T] | null;
};
