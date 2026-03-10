import { useEffect, useState } from 'react'
import { Download, X } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/lib/utils'

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)

      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      const isDismissed = localStorage.getItem('pwa-prompt-dismissed') === 'true'

      if (!isStandalone && !isDismissed) {
        setIsVisible(true)
      }
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      setIsVisible(false)
    }
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem('pwa-prompt-dismissed', 'true')
  }

  if (!isVisible) return null

  return (
    <div
      className={cn(
        'animate-in fade-in slide-in-from-bottom-4 fixed right-4 bottom-4 left-4 z-[9999] duration-500',
        'md:right-6 md:left-auto md:w-[400px]'
      )}
    >
      <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-[#016b7b]/90 p-4 text-white shadow-2xl backdrop-blur-xl">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 rounded-full p-1 transition-colors hover:bg-white/10"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10">
            <Download className="h-6 w-6" />
          </div>

          <div className="flex-1 pr-6">
            <h3 className="leading-tight font-semibold">Ekotizim mobil ilovasi</h3>
            <p className="mt-1 text-xs text-white/80">Ekotizimdan qulayroq foydalanish uchun ilovani o‘rnating.</p>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button onClick={handleInstall} className="h-9 flex-1 bg-white text-[#016b7b] hover:bg-white/90">
            O‘rnatish
          </Button>
          <Button
            variant="ghost"
            onClick={handleDismiss}
            className="h-9 px-3 text-white hover:bg-white/10 hover:text-white"
          >
            Keyinroq
          </Button>
        </div>
      </div>
    </div>
  )
}
