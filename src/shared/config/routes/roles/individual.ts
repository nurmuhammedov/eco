import { lazy } from 'react'
import { withSuspense } from '@/shared/config/routes/utils'

const Applications = lazy(() => import('@/pages/applications/ui/application-page'))
const ApplicationDetail = lazy(() => import('@/pages/applications/ui/application-detail'))
const RegisterPage = lazy(() => import('@/pages/register'))
const RegisterHFDetail = lazy(() => import('@/features/register/hf/ui/hf-detail'))
const RegisterEquipmentDetail = lazy(() => import('@/features/register/equipments/ui/equipments-detail'))
const RegisterIrsDetail = lazy(() => import('@/features/register/irs/ui/irs-detail'))
const RegisterXrayDetail = lazy(() => import('@/features/register/xray/ui/xray-detail'))
const RegisterAutoDetail = lazy(() => import('@/features/register/auto/ui/auto-detail'))
const CreateApplicationForm = lazy(() => import('@/pages/applications/ui/create-application-form'))
const CreateApplicationGrids = lazy(() => import('@/pages/applications/ui/create-application-grids'))
const RegisterUpdatePage = lazy(() => import('@/pages/register/register-update-page'))
const RegisterChangePage = lazy(() => import('@/pages/register/register-change-page'))

export const individualRoutes = [
  // APPEAL
  {
    id: 'APPEAL',
    path: 'applications',
    element: withSuspense(Applications),
  },
  {
    id: 'APPEAL',
    path: 'applications/detail/:id',
    element: withSuspense(ApplicationDetail),
  },
  {
    id: 'APPEAL',
    path: 'applications/create',
    element: withSuspense(CreateApplicationGrids),
  },
  {
    id: 'APPEAL',
    path: 'applications/create/:type',
    element: withSuspense(CreateApplicationForm),
  },

  // REGISTRY
  {
    id: 'REGISTRY',
    path: 'register',
    element: withSuspense(RegisterPage),
  },
  {
    id: 'REGISTRY',
    path: 'register/:id/hf',
    element: withSuspense(RegisterHFDetail),
  },
  {
    id: 'REGISTRY',
    path: 'register/:id/equipments',
    element: withSuspense(RegisterEquipmentDetail),
  },
  {
    id: 'REGISTRY',
    path: 'register/:id/irs',
    element: withSuspense(RegisterIrsDetail),
  },
  {
    id: 'REGISTRY',
    path: 'register/:id/xrays',
    element: withSuspense(RegisterXrayDetail),
  },
  {
    id: 'REGISTRY',
    path: 'register/:id/auto',
    element: withSuspense(RegisterAutoDetail),
  },
  {
    id: 'REGISTRY',
    path: 'register/update/:type/:id',
    element: withSuspense(RegisterUpdatePage),
  },
  {
    id: 'REGISTRY',
    path: 'register/change/:id/:type',
    element: withSuspense(RegisterChangePage),
  },
]
