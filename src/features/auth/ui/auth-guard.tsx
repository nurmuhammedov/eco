// ** React **
import { PropsWithChildren, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

// ** Store **
import { setUser } from '@/app/store/auth-slice';

// ** Hooks **
import { useCurrentUser } from '@/entities/auth';
import { useAppDispatch } from '@/shared/hooks/use-store';

// ** Components **
import { UserRoles } from '@/entities/user';
import { Loader } from '@/shared/components/common';

interface Props extends PropsWithChildren {
  allowedRoles?: UserRoles[];
}

export default function AuthGuard({ children, allowedRoles }: Props) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuth, isPending, user, isSuccess } = useCurrentUser();

  useEffect(() => {
    if (!isPending && !isAuth) {
      navigate('/auth/login/admin', {
        state: { from: pathname },
        replace: true,
      });
    }
  }, [isPending, isAuth]);

  if (isPending) {
    return <Loader isVisible message="loading" />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const hasRequiredRole = allowedRoles.includes(user?.role);

    if (user && !hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // TODO: ushbu setUser ni boshqa qismga olish kerak!
  if (isSuccess) {
    dispatch(setUser(user));
  }

  if (isAuth) return children;
}
