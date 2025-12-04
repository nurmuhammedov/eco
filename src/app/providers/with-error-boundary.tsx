import React from 'react'
import { Toaster } from 'sonner'
import { ErrorBoundary } from '@/widgets/error-boundary'

export const withErrorBoundary = (Component: React.ComponentType) => {
  return function WithErrorBoundary(props: any) {
    return (
      <ErrorBoundary>
        <Toaster expand />
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}
