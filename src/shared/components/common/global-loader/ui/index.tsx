import { Loader2 } from 'lucide-react'
import { FC, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib/utils'
import { StandaloneLoaderProps } from '../model/types'

export const Loader: FC<StandaloneLoaderProps> = memo(({ message, size = 40, isVisible = false, className }) => {
  const { t } = useTranslation('common')

  if (!isVisible) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn('flex w-full flex-1 flex-col items-center justify-center gap-3 py-12', className)}
    >
      <Loader2 size={size} aria-hidden="true" className="text-teal animate-spin" />
      {message && <p className="text-muted-foreground text-center text-sm font-medium">{t(message)}</p>}
    </div>
  )
})

Loader.displayName = 'Loader'
export default Loader
