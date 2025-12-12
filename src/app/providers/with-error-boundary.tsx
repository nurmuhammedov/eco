import React from 'react'
import { Toaster } from 'sonner'
import { ErrorBoundary } from '@/widgets/error-boundary'
import { createPortal } from 'react-dom'

export const withErrorBoundary = (Component: React.ComponentType) => {
  return function WithErrorBoundary(props: any) {
    const alertElement = document.querySelector('#alert')

    return (
      <ErrorBoundary>
        {alertElement &&
          createPortal(
            <Toaster
              expand={true}
              position={'top-right'}
              richColors
              visibleToasts={5}
              toastOptions={{
                classNames: {
                  toast: 'font-golos-text select-none text-sm cursor-pointer !w-[400px]',
                  title: 'font-golos-text text-sm',
                  description: 'font-golos text-sm',
                },
              }}
            />,
            alertElement as HTMLElement
          )}
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}
