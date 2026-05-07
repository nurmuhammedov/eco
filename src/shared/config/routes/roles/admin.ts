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
const EmployeeDeviceLoginReport = lazy(() => import('@/features/reports/ui/employee-device-login-report'))
const EmployeesDashboard = lazy(() => import('@/features/reports/ui/employees-dashboard'))
const Top100OrganizationsReport = lazy(() => import('@/features/reports/ui/top-100-organizations'))
const DecreeSignerPage = lazy(() =>
  import('@/features/admin/decree-signers').then((module) => ({ default: module.DecreeSignersPage }))
)
const HybridMailPage = lazy(() => import('@/features/admin/hybrid-mail/ui/hybrid-mail-page'))
const UserLogsPage = lazy(() => import('@/pages/admin/user-logs/page'))
const ParksPage = lazy(() => import('@/pages/admin/parks'))
const RegisterChangePage = lazy(() => import('@/pages/register/register-change-page'))
const NewsListPage = lazy(() => import('@/features/news').then((m) => ({ default: m.NewsList })))
const NewsFormPage = lazy(() => import('@/features/news').then((m) => ({ default: m.NewsForm })))
const NewsDetailPage = lazy(() => import('@/features/news').then((m) => ({ default: m.NewsDetail })))
// const ElevatorsPage = lazy(() => import('@/pages/elevators'))

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
    id: 'REPORT',
    path: 'reports/employee-device-login',
    element: withSuspense(EmployeeDeviceLoginReport),
  },
  {
    id: 'REPORT',
    path: 'reports/employees-dashboard',
    element: withSuspense(EmployeesDashboard),
  },
  {
    id: 'REPORT',
    path: 'reports/top-100-organizations',
    element: withSuspense(Top100OrganizationsReport),
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
    path: 'register/change/:id/:type',
    element: withSuspense(RegisterChangePage),
  },
  {
    path: 'parks',
    element: withSuspense(ParksPage),
  },
  {
    path: 'news',
    element: withSuspense(NewsListPage),
  },
  {
    path: 'news/create',
    element: withSuspense(NewsFormPage),
  },
  {
    path: 'news/edit/:id',
    element: withSuspense(NewsFormPage),
  },
  {
    path: 'news/:id',
    element: withSuspense(NewsDetailPage),
  },
]
