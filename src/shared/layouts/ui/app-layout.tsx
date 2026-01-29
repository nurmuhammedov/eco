import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { SIDEBAR_OPEN } from '@/app/config'
import { AppSidebar, Header } from '@/widgets'
import { useTranslation } from 'react-i18next'
import { SidebarInset, SidebarProvider } from '@/shared/components/ui/sidebar'
// import { ErrorBoundary } from '@/widgets/error-boundary' // Assuming ErrorBoundary exists or will be added later if needed, based on existing file list it seems to exist in widgets
import { ErrorBoundary } from '@/widgets/error-boundary'

export default function AppLayout() {
  const { t } = useTranslation('common')

  return (
    <SidebarProvider defaultOpen={SIDEBAR_OPEN}>
      <AppSidebar />
      <SidebarInset className="flex h-svh flex-col overflow-hidden bg-neutral-100">
        <Header />
        <main className="relative flex flex-1 flex-col overflow-auto px-3 pt-4 pb-3">
          <ErrorBoundary>
            <Suspense fallback={t('loading')}>
              <div className="max-w-8xl mx-auto flex h-full w-full flex-1 flex-col">
                <Outlet />
              </div>
            </Suspense>
          </ErrorBoundary>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
