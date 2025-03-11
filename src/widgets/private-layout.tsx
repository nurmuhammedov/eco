// ** Constants **
import { SIDEBAR_OPEN } from '@/app/config';

// ** Hooks **
import { useAuth } from '@/shared/hooks/use-auth.ts';

// ** Secondary party **
import { AppSidebar, Header } from '@/widgets';

// ** React **
import { Navigate, Outlet, useLocation } from 'react-router-dom';

// ** UI **
import { SidebarInset, SidebarProvider } from '@/shared/components/ui/sidebar';
import ErrorBoundary from '@/pages/error/ui/error-boundary.tsx';

export default function PrivateLayout() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user)
    return <Navigate to="/auth/login" state={{ from: location }} replace />;

  return (
    <SidebarProvider defaultOpen={SIDEBAR_OPEN}>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <section className="h-full p-4 3xl:p-5">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}
