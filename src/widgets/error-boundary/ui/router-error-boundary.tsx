import { memo } from 'react'
import { ErrorBoundaryCore } from './error-boundary-core'
import { useLocation, useNavigate } from 'react-router-dom'
import type { ErrorBoundaryProps } from '@/pages/error/types'

const RouterErrorBoundary = memo((props: ErrorBoundaryProps) => {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <ErrorBoundaryCore
      {...props}
      navigate={navigate}
      pathname={location.pathname}
      className={
        props?.className ? props?.className : '3xl:p-5 flex h-[calc(100svh-82px)] flex-col overflow-auto px-4 pt-4'
      }
    />
  )
})

RouterErrorBoundary.displayName = 'RouterErrorBoundary '

export { RouterErrorBoundary }
