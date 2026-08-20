import { ComponentType, Suspense } from 'react'
import { BootScreen, RouteFallback } from '@/shared/components/common'

/** For pages rendered inside the app layout: only the content area is replaced. */
export const withSuspense = (Component: ComponentType) => (
  <Suspense fallback={<RouteFallback />}>
    <Component />
  </Suspense>
)

/** For standalone pages and layouts that own the whole viewport. */
export const withFullPageSuspense = (Component: ComponentType) => (
  <Suspense fallback={<BootScreen />}>
    <Component />
  </Suspense>
)
