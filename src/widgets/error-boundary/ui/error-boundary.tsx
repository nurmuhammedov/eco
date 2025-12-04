import { memo } from 'react'
import { ErrorBoundaryProps } from '@/pages/error/types'
import { ErrorBoundaryCore } from './error-boundary-core'

export const ErrorBoundary = memo((props: ErrorBoundaryProps) => {
  return <ErrorBoundaryCore pathname="" navigate={() => {}} {...props} />
})
