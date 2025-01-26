// ** Utils **
import { pick } from '@/shared/utils';

// ** Constants **
import { SIDEBAR_OPEN } from '@/app/config';

// ** Hooks **
import { useAppSelector } from '@/store/hooks';

// ** Secondary party **
import { AppSidebar, Header } from '@/layouts';

// ** React **
import { shallowEqual } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

// ** UI components **
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
      <main className="h-full w-full bg-gray-200">
        <Header />
        <section className="h-full p-5">
          <Outlet />
        </section>
      </main>
    </SidebarProvider>
  );
}
