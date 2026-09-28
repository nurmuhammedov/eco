import { lazy } from 'react'

// Auth pages
const AdminLogin = lazy(() => import('@/pages/auth/ui/admin-login'))
const OneIdLoginPage = lazy(() => import('@/pages/auth/ui/login-page'))
const NotFound = lazy(() => import('@/pages/error/ui/page-not-found'))
const ContactPage = lazy(() => import('@/pages/qr-form'))
const PublicRiskAnalysisInfo = lazy(() => import('@/features/risk-analysis/ui/public-risk-analysis-info'))
const PublicInquiryChoice = lazy(() => import('@/pages/public-inquiry/ui/public-inquiry-choice'))

import { withFullPageSuspense } from '@/app/routes/utils'

export const publicRoutes = [
  {
    path: '/qr/:id/equipments',
    element: withFullPageSuspense(ContactPage),
  },
  {
    path: '/public/risk-analysis/:id',
    element: withFullPageSuspense(PublicRiskAnalysisInfo),
  },
  {
    path: '/public-inquiry-choice',
    element: withFullPageSuspense(PublicInquiryChoice),
  },
]

export const authRoutes = [
  {
    path: 'login',
    element: withFullPageSuspense(OneIdLoginPage),
  },
  {
    path: 'login/admin',
    element: withFullPageSuspense(AdminLogin),
  },
]

export const specialComponents = {
  notFound: NotFound,
}
