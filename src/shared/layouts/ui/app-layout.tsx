import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { SIDEBAR_OPEN } from '@/app/config';
import { AppSidebar, Header } from '@/widgets';
import { useTranslation } from 'react-i18next';
import { SidebarInset, SidebarProvider } from '@/shared/components/ui/sidebar';

export default function AppLayout() {
  const { t } = useTranslation('common');

  return (
    <SidebarProvider defaultOpen={SIDEBAR_OPEN}>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <Suspense fallback={t('loading')}>
          <Outlet />
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  );
}
