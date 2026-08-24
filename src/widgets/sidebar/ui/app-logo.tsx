import { cn } from '@/shared/lib/utils'
import { useTranslation } from 'react-i18next'
import { useSidebar } from '@/shared/components/ui/sidebar'
import { BrandLogo } from '@/shared/components/common'

export function AppLogo() {
  const { state } = useSidebar()
  const { t } = useTranslation(['common'])

  const sidebarOpen = state === 'expanded'

  return (
    <div className="flex flex-row items-center gap-x-3 overflow-hidden py-2">
      <div className="relative size-8 min-w-8">
        <BrandLogo className="size-full" />
      </div>
      <div
        className={cn('flex flex-col opacity-100 transition-opacity duration-300', {
          'hidden w-0 opacity-0': !sidebarOpen,
        })}
      >
        <span className="text-sidebar-foreground text-xs leading-tight font-medium">{t('app.name')}</span>
      </div>
    </div>
  )
}
