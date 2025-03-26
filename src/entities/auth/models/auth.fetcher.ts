import { queryClient } from '@/shared/api';
import { setUser } from '@/app/store/auth-slice';
import { authAPI } from '@/entities/auth/models/auth.api';
import { useAppDispatch } from '@/shared/hooks/use-store';
import { getHomeRouteForLoggedInUser } from '@/app/routes';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthUser } from '@/entities/auth/models/auth.model';
import { LoginDTO } from '@/entities/auth/models/auth.types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { UserRoles } from '@/shared/types';
import { useAuth } from '@/shared/hooks/use-auth.ts';

export const useCurrentUser = () => {
  const {
    data: user,
    isPending,
    isSuccess,
    error,
  } = useQuery({
    queryKey: ['me'],
    queryFn: async () => authAPI.getMe(),
    retry: 1,
  });

  return { user, error, isPending, isSuccess, isAuth: user && !error };
};

export const useLogin = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: async (data: LoginDTO) => authAPI.login(data),

    onSuccess: (data: AuthUser) => {
      dispatch(setUser(data));
      queryClient.setQueryData(['currentUser'], data);
      const redirectPath = state?.from
        ? state?.from
        : getHomeRouteForLoggedInUser(data.role);
      navigate(redirectPath);
    },
  });
};

export const useLogout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const redirectPath =
    user?.role === UserRoles.ADMIN ? '/auth/login/admin' : '/auth/login';
  return useMutation({
    mutationFn: async () => authAPI.logout(),
    onSuccess: () => {
      navigate(redirectPath);
    },
  });
};
