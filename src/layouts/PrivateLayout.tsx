import { pick } from '@/shared/utils';
import { AppSidebar } from '@/layouts';
import { shallowEqual } from 'react-redux';
import { SIDEBAR_OPEN } from '@/app/config';
import { useAppSelector } from '@/store/hooks';
import Header from '@/layouts/components/Header';
import { Navigate, Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/shared/components/ui/sidebar';

export default function PrivateLayout() {
  const { isAuthenticated } = useAppSelector(
    (state) => pick(state.auth, ['isAuthenticated']),
    shallowEqual,
  );

  if (!isAuthenticated) return <Navigate to="/login" />;

  return (
    <SidebarProvider className="flex text-sm" defaultOpen={SIDEBAR_OPEN}>
      <AppSidebar />
      <main className="h-full w-full">
        <Header />
        <section className="p-5">
          <Outlet />
        </section>
      </main>
    </SidebarProvider>
  );
}
