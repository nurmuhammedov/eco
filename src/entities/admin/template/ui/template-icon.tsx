import { cn } from '@/shared/lib/utils'
import { getInitials } from '@/shared/utils'
import { TemplateType } from '@/entities/admin/template'

interface TemplateTypeStyleMap {
  [key: string]: {
    text: string
    border: string
    background: string
  }
}

const TEMPLATE_TYPE_STYLES: TemplateTypeStyleMap = {
  [TemplateType.XICHO_APPEAL]: {
    background: 'bg-purple-100',
    border: 'border-purple-200',
    text: 'text-purple-700',
  },
  [TemplateType.EQUIPMENT_APPEAL]: {
    background: 'bg-blue-100',
    border: 'border-blue-200',
    text: 'text-blue-700',
  },
  [TemplateType.IRS_APPEAL]: {
    background: 'bg-green-100',
    border: 'border-green-200',
    text: 'text-green-700',
  },
  default: {
    background: 'bg-gray-100',
    border: 'border-gray-200',
    text: 'text-gray-700',
  },
}

interface TemplateTypeIconProps {
  name: string
  type: TemplateType
  className?: string
}

export const TemplateTypeIcon = ({ name, type, className }: TemplateTypeIconProps) => {
  const style = TEMPLATE_TYPE_STYLES[type] || TEMPLATE_TYPE_STYLES.default

  return (
    <div
      className={cn(
        'flex size-10 items-center justify-center rounded-md border',
        style.background,
        style.border,
        className
      )}
    >
      <span className={cn('text-sm font-semibold', style.text)}>{getInitials(name)}</span>
    </div>
  )
}
