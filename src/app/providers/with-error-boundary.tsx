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
              closeButton={true}
              duration={10000}
              toastOptions={{
                classNames: {
                  toast:
                    'font-golos-text select-none text-sm cursor-pointer !w-[400px] group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
                  title: 'font-golos-text text-sm',
                  description: 'font-golos-text font-golos-text group-[.toast]:text-muted-foreground',
                  actionButton: 'font-golos-text group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
                  cancelButton: 'font-golos-text group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
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
