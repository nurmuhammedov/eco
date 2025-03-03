import { UserRoles } from '@/shared/types';
import { useAuth } from '@/shared/hooks/use-auth.ts';
import { Navigate, Outlet } from 'react-router-dom';
import { getHomeRouteForLoggedInUser } from '@/app/routes';

export default function PublicLayout() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to={getHomeRouteForLoggedInUser(UserRoles.ADMIN)} />;
  }

  return <Outlet />;
}
