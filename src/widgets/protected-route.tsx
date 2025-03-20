// ** React **
import { PropsWithChildren, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// ** Hooks **
import { useCurrentUser } from '@/entities/auth/models/auth.fetcher';

export default function ProtectedRoute({ children }: PropsWithChildren) {
  const location = useLocation();
  const navigate = useNavigate();
  // const { showLoader, hideLoader } = useLoader();
  const { isAuth, isPending } = useCurrentUser();
  useEffect(() => {
    if (!isPending && !isAuth) {
      navigate('/auth/login/admin', { state: { from: location } });
    }
  }, [isPending, isAuth]);

  if (isPending) {
    return 'Loading....';
  }

  // if (isSuccess && isAuth) {
  //   return navigate('/admin/districts');
  // }

  if (isAuth) return children;
}
