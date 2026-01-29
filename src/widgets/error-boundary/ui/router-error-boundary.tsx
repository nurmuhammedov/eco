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
      className={props?.className ? props?.className : 'h-full w-full'}
    />
  )
})

RouterErrorBoundary.displayName = 'RouterErrorBoundary '

export { RouterErrorBoundary }
