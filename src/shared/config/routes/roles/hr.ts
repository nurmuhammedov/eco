import { lazy } from 'react'
import { withSuspense } from '@/shared/config/routes/utils'

const DepartmentsPage = lazy(() => import('@/pages/kpi/departments-page'))
const KpiTasksPage = lazy(() => import('@/pages/kpi/kpi-tasks-page'))
const TurniketLogsReport = lazy(() => import('@/features/reports/ui/turniket-report'))
const TurniketLogsDetail = lazy(() => import('@/features/reports/ui/turniket-report-detail'))

export const hrRoutes = [
  {
    path: 'kpi/departments',
    element: withSuspense(DepartmentsPage),
  },
  {
    path: 'kpi/tasks',
    element: withSuspense(KpiTasksPage),
  },
  // "My KPI" is intentionally absent: a reviewer must not submit and approve their own results.
  {
    path: 'user-delegation',
    element: withSuspense(lazy(() => import('@/pages/hr/user-delegation-page'))),
  },
  {
    path: 'reports/turniket-logs',
    element: withSuspense(TurniketLogsReport),
  },
  {
    path: 'reports/turniket-logs/:id',
    element: withSuspense(TurniketLogsDetail),
  },
]
