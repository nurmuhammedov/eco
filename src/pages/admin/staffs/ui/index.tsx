import { lazy } from 'react'

const StaffsWidget = lazy(() => import('@/widgets/admin/staffs/ui/staffs'))

export default function StaffsPage() {
  return <StaffsWidget />
}
