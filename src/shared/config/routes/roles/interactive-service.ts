import { lazy } from 'react'
import { withSuspense } from '@/shared/config/routes/utils'

const InteractiveServicePage = lazy(() =>
  import('@/pages/interactive-service').then((m) => ({ default: m.InteractiveServicePage }))
)

export const interactiveServiceRoutes = [
  {
    path: 'interactive-service',
    element: withSuspense(InteractiveServicePage),
  },
]
