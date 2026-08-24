import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FC, PropsWithChildren } from 'react'
import { DEFAULT_STALE_TIME } from '@/shared/lib/query/stale-time'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
      staleTime: DEFAULT_STALE_TIME,
    },
  },
})

export const withQuery = (Component: FC<PropsWithChildren>): FC<PropsWithChildren> => {
  const WithQuery: FC<PropsWithChildren> = (props) => (
    <QueryClientProvider client={queryClient}>
      <Component {...props} />
    </QueryClientProvider>
  )

  return WithQuery
}
