import type { LucideIcon } from 'lucide-react'
import { ApplicationIcons } from '../lib/application-icons'
import { ApplicationCategory, ApplicationTypeEnum, MainApplicationCategory } from './enums'

/** A group of applications a category opens with, such as registering or deregistering */
export interface MainApplicationCard {
  id: MainApplicationCategory
  title: string
  description: string
  icon: LucideIcon
}

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
