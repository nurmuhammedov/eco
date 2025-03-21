// ** React **
import { PropsWithChildren, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// ** Hooks **
import { useCurrentUser } from '@/entities/auth/models/auth.fetcher';
import { Loader } from '@/shared/components/common/global-loader/ui';
import { useAppDispatch } from '@/shared/hooks/use-store';
import { setUser } from '@/app/store/auth-slice.ts';

export default function ProtectedRoute({ children }: PropsWithChildren) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuth, isPending, user, isSuccess } = useCurrentUser();
  useEffect(() => {
    if (!isPending && !isAuth) {
      navigate('/auth/login/admin', { state: { from: location } });
    }
  }, [isPending, isAuth]);

  if (isPending) {
    return <Loader isVisible message="loading" />;
  }

  if (isSuccess) {
    dispatch(setUser(user));
  }

  if (isAuth) return children;
}
