import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { SIDEBAR_OPEN } from '@/app/config'
import { AppSidebar, Header } from '@/widgets'
import { NavigationProgressProvider, RouteFallback } from '@/shared/components/common'
import { SidebarInset, SidebarProvider } from '@/shared/components/ui/sidebar'
import { ErrorBoundary } from '@/widgets/error-boundary'

export default function AppLayout() {
  return (
    <NavigationProgressProvider>
      <SidebarProvider defaultOpen={SIDEBAR_OPEN}>
        <AppSidebar />
        <SidebarInset className="flex h-svh flex-col overflow-hidden bg-neutral-100">
          <Header />
          <main className="relative flex flex-1 flex-col overflow-auto px-3 pt-4 pb-3">
            <ErrorBoundary>
              <div className="max-w-8xl mx-auto flex h-full w-full flex-1 flex-col">
                <Suspense fallback={<RouteFallback />}>
                  <Outlet />
                </Suspense>
              </div>
            </ErrorBoundary>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </NavigationProgressProvider>
  )
}
