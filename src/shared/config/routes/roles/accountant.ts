import { lazy } from 'react'
import { withSuspense } from '@/shared/config/routes/utils'

const InquiryListPage = lazy(() => import('@/features/inquiries/ui/inquiry-list'))
const InquiryAddPage = lazy(() => import('@/pages/inquiries/ui/inquiry-add'))
const InquiryDetailPage = lazy(() => import('@/pages/inquiries/ui/inquiry-detail'))

export const accountantRoutes = [
  {
    id: 'INQUIRY',
    path: 'inquiries',
    element: withSuspense(InquiryListPage),
  },
  {
    id: 'INQUIRY',
    path: 'inquiries/add',
    element: withSuspense(InquiryAddPage),
  },
  {
    id: 'INQUIRY',
    path: 'inquiries/detail/:id',
    element: withSuspense(InquiryDetailPage),
  },
]
