import Icon from '@/shared/components/common/icon'
import { cn } from '@/shared/lib/utils'

interface NoDataProps {
  className?: string
  text?: string
}

export const NoData = ({ className, text }: NoDataProps) => {
  return (
    <div className={cn('flex w-full flex-col items-center justify-start gap-4 pt-10', className)}>
      <Icon name="no-data" size={160} />
      <p className="text-muted-foreground font-medium">{text || 'Hech qanday maʼlumot topilmadi!'}</p>
    </div>
  )
}
