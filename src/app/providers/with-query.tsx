import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FC, PropsWithChildren } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 0, // 0 minutes
    },
  },
});

/**
 * React Query provider
 */
export const withQuery = (Component: FC<PropsWithChildren>): FC<PropsWithChildren> => {
  return (props) => (
    <QueryClientProvider client={queryClient}>
      <Component {...props} />
    </QueryClientProvider>
  );
};
