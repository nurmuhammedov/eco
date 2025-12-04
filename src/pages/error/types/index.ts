import { RefreshCw } from 'lucide-react'
import React, { ErrorInfo } from 'react'

export type ErrorAction = {
  label: string
  icon: typeof RefreshCw
  action: () => void
  variant: 'default' | 'outline' | 'ghost' | 'secondary'
}

export type ErrorFallbackProps = {
  error: Error | null
  resetError: () => void
  reloadPage: () => void
  goBack: () => void
  goHome: () => void
  isDev: boolean
  errorInfo?: ErrorInfo
}

export type ErrorBoundaryProps = {
  children: React.ReactNode
  fallback?: React.ComponentType<ErrorFallbackProps>
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  resetOnRouteChange?: boolean
  shouldCaptureError?: (error: Error) => boolean
  className?: string
}

export type ErrorBoundaryState = {
  hasError: boolean
  error: Error | null
  errorInfo?: ErrorInfo
}
