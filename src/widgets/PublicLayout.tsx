import { pick } from '@/shared/utils';
import { UserRoles } from '@/shared/types';
import { shallowEqual } from 'react-redux';
import { useAppSelector } from '@/app/store/hooks.ts';
import { Navigate, Outlet } from 'react-router-dom';
import { getHomeRouteForLoggedInUser } from '@/app/routes';

export default function PublicLayout() {
  const { isAuthenticated } = useAppSelector(
    (state) => pick(state.auth, ['isAuthenticated']),
    shallowEqual,
  );

  if (isAuthenticated) {
    return <Navigate to={getHomeRouteForLoggedInUser(UserRoles.ADMIN)} />;
  }

  return <Outlet />;
}
