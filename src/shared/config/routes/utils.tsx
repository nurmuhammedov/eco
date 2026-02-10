import { ComponentType, Suspense } from 'react'
import { Loader } from '@/shared/components/common'

export const withSuspense = (Component: ComponentType) => (
  <Suspense fallback={<Loader isVisible />}>
    <Component />
  </Suspense>
)
