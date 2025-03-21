// ** React **
import { PropsWithChildren, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// ** Hooks **
import { useCurrentUser } from '@/entities/auth/models/auth.fetcher';
import { Loader } from '@/shared/components/common/global-loader/ui';

export default function ProtectedRoute({ children }: PropsWithChildren) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuth, isPending } = useCurrentUser();
  useEffect(() => {
    if (!isPending && !isAuth) {
      navigate('/auth/login/admin', { state: { from: location } });
    }
  }, [isPending, isAuth]);

  if (isPending) {
    return (
      <Loader
        isVisible
        bgOpacity={0}
        message="loading"
        containerBgColor={''}
        containerShadow={''}
        containerRounded={''}
      />
    );
  }

  if (isAuth) return children;
}
