// ** Constants **
import { SIDEBAR_OPEN } from '@/app/config';

// ** Hooks **
import { useAuth } from '@/shared/hooks/useAuth';

// ** Secondary party **
import { AppSidebar, Header } from '@/widgets';

// ** React **
import { Navigate, Outlet, useLocation } from 'react-router-dom';

// ** UI **
import { SidebarInset, SidebarProvider } from '@/shared/components/ui/sidebar';

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
        <section className="h-full p-5">
          <Outlet />
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}
