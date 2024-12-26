import { UserRoles } from '@/shared/types';
import { Navigate, Outlet } from 'react-router-dom';
import { getHomeRouteForLoggedInUser } from '@/app/routes/routeUtils';

export default function PublicLayout() {
  const isAuthenticated = false;

  if (isAuthenticated) {
    return <Navigate to={getHomeRouteForLoggedInUser(UserRoles.ADMIN)} />;
  }

  return <Outlet />;
}
