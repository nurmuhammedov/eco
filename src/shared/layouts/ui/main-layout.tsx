// ** React **
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

// ** Constants **
import { SIDEBAR_OPEN } from '@/app/config';

// ** Secondary party **
import { AppSidebar, Header } from '@/widgets';

// ** Hooks **
import { useTranslation } from 'react-i18next';

// ** UI **
import { SidebarInset, SidebarProvider } from '@/shared/components/ui/sidebar';

export default function MainLayout() {
  const { t } = useTranslation('common');
  return (
    <SidebarProvider defaultOpen={SIDEBAR_OPEN}>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <Suspense fallback={t('loading')}>
          <section className="h-full px-4 pt-4 3xl:p-5">
            <Outlet />
          </section>
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  );
}
