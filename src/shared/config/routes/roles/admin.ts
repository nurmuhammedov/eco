import { lazy } from 'react'
import { withSuspense } from '@/shared/config/routes/utils'

const MetricsPage = lazy(() => import('@/pages/admin/metrics/page'))
const StaffsPage = lazy(() => import('@/pages/admin/staffs/ui'))
const RegionsPage = lazy(() => import('@/pages/admin/regions/ui'))
const DepartmentPage = lazy(() => import('@/pages/admin/department/ui'))
const EquipmentPage = lazy(() => import('@/pages/admin/equipment/equipment-page'))
const HazardousFacilitiesPage = lazy(() => import('@/pages/admin/hazardous-facility/ui'))
const InspectionSurveys = lazy(() => import('@/pages/admin/inspection/ui'))
const AttractionTypePage = lazy(() => import('@/pages/admin/attraction-type/page'))
const DecreeSignerPage = lazy(() =>
  import('@/features/admin/decree-signers').then((module) => ({ default: module.DecreeSignersPage }))
)
const HybridMailPage = lazy(() => import('@/features/admin/hybrid-mail/ui/hybrid-mail-page'))
const UserLogsPage = lazy(() => import('@/pages/admin/user-logs/page'))
const AccidentList = lazy(() =>
  import('@/features/accident/ui/accident-list').then((m) => ({ default: m.AccidentList }))
)
const AccidentAdd = lazy(() => import('@/features/accident/ui/accident-form').then((m) => ({ default: m.AccidentAdd })))
const AccidentDetail = lazy(() =>
  import('@/features/accident/ui/accident-detail').then((m) => ({ default: m.AccidentDetail }))
)

export const adminRoutes = [
  {
    path: 'territories',
    element: withSuspense(RegionsPage),
  },
  {
    path: 'department',
    element: withSuspense(DepartmentPage),
  },
  {
    path: 'inspection-surveys',
    element: withSuspense(InspectionSurveys),
  },
  {
    path: 'staffs',
    element: withSuspense(StaffsPage),
  },
  {
    path: 'hazardous-facilities',
    element: withSuspense(HazardousFacilitiesPage),
  },
  {
    path: 'equipments',
    element: withSuspense(EquipmentPage),
  },
  {
    path: 'attraction-types',
    element: withSuspense(AttractionTypePage),
  },
  {
    path: 'decree-signers',
    element: withSuspense(DecreeSignerPage),
  },
  {
    path: 'hybrid-mail',
    element: withSuspense(HybridMailPage),
  },
  {
    path: 'user-logs',
    element: withSuspense(UserLogsPage),
  },
  {
    path: 'metrics',
    element: withSuspense(MetricsPage),
  },
  {
    id: 'ACCIDENT',
    path: 'accidents',
    element: withSuspense(AccidentList),
  },
  {
    id: 'ACCIDENT',
    path: 'accidents/add',
    element: withSuspense(AccidentAdd),
  },
  {
    id: 'ACCIDENT',
    path: 'accidents/:id',
    element: withSuspense(AccidentDetail),
  },
]
