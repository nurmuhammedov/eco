// ** Utils **
import { cn } from '@/shared/lib/utils';

// ** Hooks **
import { useTranslation } from 'react-i18next';
import { useSidebar } from '@/shared/components/ui/sidebar';

// ** Components **
import Icon from '@/shared/components/common/icon';

export function AppLogo() {
  const { state } = useSidebar();
  const { t } = useTranslation(['common']);

  const sidebarOpen = state === 'expanded';

  return (
    <div className="flex items-center font-bold flex-row gap-x-2.5">
      <div>
        <Icon
          name="logo"
          className={cn('size-8 md:size-9 lg:size-12', {
            hidden: !sidebarOpen,
          })}
        />
      </div>
      <h6
        className={cn('text-xm 3xl:text-sm font-semibold leading-4', {
          hidden: !sidebarOpen,
        })}
      >
        {t('app.name')}
      </h6>
    </div>
  );
}
