export enum UIModeEnum {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  VIEW = 'VIEW',
}

export interface UIState {
  data?: any;
  name?: string;
  isOpen: boolean;
  mode?: UIModeEnum;
}

export type PayloadUI<T> = { mode: UIModeEnum; name: string; data?: T };
