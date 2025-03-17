export enum UIModeEnum {
  CREATE = 'create',
  EDIT = 'edit',
  VIEW = 'view',
  DELETE = 'delete',
}

export const UI_COMPONENTS = {
  REGION_DRAWER: 'region-drawer',
  DISTRICT_DRAWER: 'district-drawer',
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
    name: string;
    code: string;
  };
  [UI_COMPONENTS.DISTRICT_DRAWER]: {
    id: number;
    name: string;
    code: string;
    regionId: number;
    regionName?: string;
  };
}

export type PayloadUI<T extends UIComponentName> = {
  mode: UIModeEnum;
  componentName: T;
  data?: UIComponentDataMap[T] | null;
};
