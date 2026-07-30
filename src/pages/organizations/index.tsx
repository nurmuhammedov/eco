import { lazy } from 'react'

const OrganizationList = lazy(() => import('@/features/organizations').then((m) => ({ default: m.OrganizationList })))

export default function OrganizationsPage() {
  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden">
      <OrganizationList />
    </div>
  )
}
