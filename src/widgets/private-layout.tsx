// ** React **
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

// ** Constants **
import { SIDEBAR_OPEN } from '@/app/config';

// ** Secondary party **
import { AppSidebar, Header } from '@/widgets';

// ** UI **
import { SidebarInset, SidebarProvider } from '@/shared/components/ui/sidebar';

export default function PrivateLayout() {
  return (
    <SidebarProvider defaultOpen={SIDEBAR_OPEN}>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <Suspense fallback="Loading...">
          <section className="h-full p-4 3xl:p-5">
            <Outlet />
          </section>
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  );
}
