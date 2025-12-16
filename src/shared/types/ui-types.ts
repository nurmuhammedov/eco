export enum UIModeEnum {
  EDIT = 'edit',
  VIEW = 'view',
  DELETE = 'delete',
  CREATE = 'create',
}

export const UI_COMPONENTS = {
  REGION_DRAWER: 'region-drawer',
  DISTRICT_DRAWER: 'regions-drawer',
  TEMPLATE_DRAWER: 'template-drawer',
  EQUIPMENT_DRAWER: 'equipment-drawer',
  CENTRAL_APPARATUS_DRAWER: 'central-apparatus',
  TERRITORIAL_DEPARTMENTS_DRAWER: 'territorial-departments',
  COMMITTEE_STAFFS_DRAWER: 'committee-staffs',
  TERRITORIAL_STAFFS_DRAWER: 'territorial-staffs',
  HAZARDOUS_FACILITY_TYPE_DRAWER: 'hazardous-facility-type',
  ATTRACTION_TYPE_DRAWER: 'attraction-type-drawer',
  CHECKLIST_TEMPLATES_DRAWER: 'checklist-templates-drawer',
  CHECKLISTS: 'checklist',
  CATEGORY_TYPES: 'category-types',
} as const

export type UIComponentName = (typeof UI_COMPONENTS)[keyof typeof UI_COMPONENTS]

export interface UIState<T = unknown> {
  isOpen: boolean
  mode: UIModeEnum | undefined
  componentName: UIComponentName | undefined
  data: T | null
}

export interface UIComponentDataMap {
  [UI_COMPONENTS.REGION_DRAWER]: {
    id: number
  }
  [UI_COMPONENTS.DISTRICT_DRAWER]: {
    id: number
  }
  [UI_COMPONENTS.CENTRAL_APPARATUS_DRAWER]: {
    id: number
  }
  [UI_COMPONENTS.TERRITORIAL_DEPARTMENTS_DRAWER]: {
    id: number
  }
  [UI_COMPONENTS.COMMITTEE_STAFFS_DRAWER]: {
    id: string
  }
  [UI_COMPONENTS.TERRITORIAL_STAFFS_DRAWER]: {
    id: string
  }
  [UI_COMPONENTS.HAZARDOUS_FACILITY_TYPE_DRAWER]: {
    id: number
  }
  [UI_COMPONENTS.TEMPLATE_DRAWER]: {
    id: number
  }
  [UI_COMPONENTS.EQUIPMENT_DRAWER]: {
    id: number
  }
  [UI_COMPONENTS.ATTRACTION_TYPE_DRAWER]: {
    id: number
  }
  [UI_COMPONENTS.CHECKLIST_TEMPLATES_DRAWER]: {
    id: number
  }
  [UI_COMPONENTS.CHECKLISTS]: {
    id: number
  }
  [UI_COMPONENTS.CATEGORY_TYPES]: {
    id: number
  }
}

export type PayloadUI<T extends UIComponentName> = {
  mode: UIModeEnum
  componentName: T
  data?: UIComponentDataMap[T] | null
}
