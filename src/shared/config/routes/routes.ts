import { lazy } from 'react'

// Auth pages
const AdminLogin = lazy(() => import('@/pages/auth/ui/admin-login'))
const OneIdLoginPage = lazy(() => import('@/pages/auth/ui/login-page'))
const NotFound = lazy(() => import('@/pages/error/ui/page-not-found'))
const ContactPage = lazy(() => import('@/pages/qr-form'))
const PublicRiskAnalysisInfo = lazy(() => import('@/features/risk-analysis/ui/public-risk-analysis-info.tsx'))

import { withSuspense } from '@/shared/config/routes/utils'

export const publicRoutes = [
  {
    path: '/qr/:id/equipments',
    element: withSuspense(ContactPage as any),
  },
  {
    path: '/public/risk-analysis/:id',
    element: withSuspense(PublicRiskAnalysisInfo as any),
  },
]

export const authRoutes = [
  {
    path: 'login',
    element: withSuspense(OneIdLoginPage),
  },
  {
    path: 'login/admin',
    element: withSuspense(AdminLogin),
  },
]

export const specialComponents = {
  notFound: NotFound,
}
