import { FC } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7'
import { useAppRoutes } from '@/shared/hooks/use-app-routes'

const AppRoutes = () => {
  return useAppRoutes()
}

export const withRouter = (_Component: FC): FC => {
  const WithRouter: FC = () => {
    return (
      <NuqsAdapter>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </NuqsAdapter>
    )
  }

  return WithRouter
}
