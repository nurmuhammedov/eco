import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { setUser } from '@/app/store/auth-slice';
import { useMutation, useQuery } from '@tanstack/react-query';
import { authAPI } from '@/entities/auth/models/auth.api';
import { useAppDispatch } from '@/shared/hooks/use-store';
import { AuthUser } from '@/entities/auth/models/auth.model';
import { LoginDTO } from '@/entities/auth/models/auth.types';
import { queryClient } from '@/shared/api';
import { useLocation, useNavigate } from 'react-router-dom';
import { getHomeRouteForLoggedInUser } from '@/app/routes';

export const useCurrentUser = () => {
  const {
    data: user,
    isPending,
    isSuccess,
    error,
  } = useQuery({
    // enabled: false,
    queryKey: ['me'],
    queryFn: async () => authAPI.getMe(),
    retry: (failureCount, error: AxiosError) => {
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 1;
    },
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
      const redirectPath = state.from
        ? state.from
        : getHomeRouteForLoggedInUser(data.role);
      navigate(redirectPath);
    },
    onError: (error) => {
      toast(error.message);
    },
  });
};
