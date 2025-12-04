import { lazy } from 'react'

const InspectionManagement = lazy(() => import('@/widgets/admin/inspection-management/ui/inspection-management'))

export default function InspectionPage() {
  return <InspectionManagement />
}
