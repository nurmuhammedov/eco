import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { withProviders } from '@/app/providers'
import { setupServiceWorker } from '@/app/pwa/register-sw'
import '@/app/styles/globals.css'
import '@/shared/validation/zod-setup'

const App = () => null
const AppWithProviders = withProviders(App)

const container = document.getElementById('root')

if (container) {
  createRoot(container).render(
    <StrictMode>
      <AppWithProviders />
    </StrictMode>
  )

  setupServiceWorker()
}
