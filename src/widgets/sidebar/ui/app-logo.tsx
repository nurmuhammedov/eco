// ** Utils **
import { cn } from '@/shared/lib/utils';

// ** Constants **
import { APP_LOGO } from '@/app/config';

// ** Hooks **
import { useSidebar } from '@/shared/components/ui/sidebar';
import { useTranslation } from 'react-i18next';

export function AppLogo() {
  const { state } = useSidebar();
  const { t } = useTranslation(['common']);

  const sidebarOpen = state === 'expanded';

  return (
    <div className="flex items-center font-bold flex-row gap-x-2.5">
      <img
        width={48}
        height={48}
        src={APP_LOGO}
        alt="DataTable Logo"
        className={cn('w-8 h-8 md:w-9 md:h-9 lg:w-12 lg:h-12', {
          hidden: !sidebarOpen,
        })}
      />
      <h6
        className={cn('text-xm leading-4 font-inter', {
          hidden: !sidebarOpen,
        })}
      >
        {t('app.name')}
      </h6>
    </div>
  );
}
