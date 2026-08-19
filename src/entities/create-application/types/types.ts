import { ApplicationIcons } from '@/entities/create-application'
import { ApplicationCategory, ApplicationTypeEnum, MainApplicationCategory } from './enums'

export interface ApplicationCardItem {
  id: number
  title: string
  name?: string
  description: string
  type: ApplicationTypeEnum
  category?: ApplicationCategory
  parentId?: MainApplicationCategory
  equipmentType?: ApplicationTypeEnum
  icon: keyof typeof ApplicationIcons
  /** Temporarily unavailable: hidden behind a disabled card and blocked by URL */
  disabled?: boolean
}
