import { FC, lazy } from 'react';
import { Toaster } from 'sonner';
import { AuthGuard } from '@/features/auth';
import { RouterProvider } from 'react-router-dom';
import { createAppRouter } from '@/shared/lib/router';
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7';

const AppLayout = lazy(() => import('@/shared/layouts/ui/app-layout'));
const AuthLayout = lazy(() => import('@/shared/layouts/ui/auth-layout'));

export const withRouter = (_Component: FC): FC => {
  return () => {
    // Create router instance
    const router = createAppRouter(AppLayout, AuthLayout, AuthGuard);

    return (
      <NuqsAdapter>
        <Toaster expand />
        <RouterProvider router={router} />
      </NuqsAdapter>
    );
  };
};
