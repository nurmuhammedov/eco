import { lazy } from 'react'

const RegisterWidget = lazy(() => import('@/widgets/register/ui/register-widget'))

export default function ArchivePage() {
  return <RegisterWidget isArchive={true} />
}
