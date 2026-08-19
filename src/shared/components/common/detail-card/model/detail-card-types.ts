import { ReactNode } from 'react'
import { IconName } from '@/shared/components/common/icon'

export interface DetailCardProps {
  title: string
  icon?: ReactNode
  children: ReactNode
}

export interface DetailCardAccordionProps {
  multiple?: boolean
  children: ReactNode
  defaultValue?: string[]
  value?: string[]
  onValueChange?: (value: string[]) => void
}

export interface DetailCardAccordionItemProps {
  value: string
  title: string
  icon?: IconName
  className?: string
  action?: ReactNode
  children: ReactNode
}
