import { lazy } from 'react'

const ElevatorsWidget = lazy(() => import('@/widgets/elevators/ui/elevators-widget'))

export default function ElevatorsPage() {
  return <ElevatorsWidget />
}
