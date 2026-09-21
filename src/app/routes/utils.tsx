import { ComponentType, Suspense } from 'react'
import { BootScreen, RouteFallback } from '@/shared/components/common'

/**
 * For pages rendered inside the app layout: only the content area is replaced.
 * Pass `Fallback` when the page shape differs from the generic list layout.
 */
export const withSuspense = (Component: ComponentType, Fallback: ComponentType = RouteFallback) => (
  <Suspense fallback={<Fallback />}>
    <Component />
  </Suspense>
)

/** For standalone pages and layouts that own the whole viewport. */
export const withFullPageSuspense = (Component: ComponentType) => (
  <Suspense fallback={<BootScreen />}>
    <Component />
  </Suspense>
)
