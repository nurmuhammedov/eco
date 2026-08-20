import { lazy } from 'react'

// Auth pages
const AdminLogin = lazy(() => import('@/pages/auth/ui/admin-login'))
const OneIdLoginPage = lazy(() => import('@/pages/auth/ui/login-page'))
const NotFound = lazy(() => import('@/pages/error/ui/page-not-found'))
const ContactPage = lazy(() => import('@/pages/qr-form'))
const PublicRiskAnalysisInfo = lazy(() => import('@/features/risk-analysis/ui/public-risk-analysis-info.tsx'))
const PublicInquiryChoice = lazy(() => import('@/pages/public-inquiry/ui/public-inquiry-choice'))
// const PublicInquiryForm = lazy(() => import('@/pages/public-inquiry/ui/public-inquiry-form'))

import { withFullPageSuspense } from '@/shared/config/routes/utils'

export const publicRoutes = [
  {
    path: '/qr/:id/equipments',
    element: withFullPageSuspense(ContactPage as any),
  },
  {
    path: '/public/risk-analysis/:id',
    element: withFullPageSuspense(PublicRiskAnalysisInfo as any),
  },
  {
    path: '/public-inquiry-choice',
    element: withFullPageSuspense(PublicInquiryChoice as any),
  },
  // {
  //   path: '/public-inquiry/form',
  //   element: withFullPageSuspense(PublicInquiryForm as any),
  // },
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
