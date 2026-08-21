import { useCallback, useEffect, useState } from 'react'
import { Download, X } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { getTime } from '@/shared/lib/get-time'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const SNOOZE_KEY = 'pwa-prompt-snoozed-until'
/** Dismissing means "not now", so the offer comes back after a fortnight. */
const SNOOZE_DURATION = getTime(2, 'week')
/** Chrome fires the event during the first paint; offering an install that early is intrusive. */
const APPEAR_DELAY = getTime(20, 'second')

const isSnoozed = (): boolean => {
  try {
    const until = Number(localStorage.getItem(SNOOZE_KEY))

    return Number.isFinite(until) && until > Date.now()
  } catch {
    return false
  }
}

const snooze = (): void => {
  try {
    localStorage.setItem(SNOOZE_KEY, String(Date.now() + SNOOZE_DURATION))
  } catch {
    // Private mode: the prompt may reappear next session.
  }
}

export const PWAInstallPrompt = () => {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches

    if (isStandalone || isSnoozed()) return

    let appearTimer: ReturnType<typeof setTimeout>

    const onBeforeInstallPrompt = (event: Event) => {
      // Keeping the event lets the app decide when to show the browser dialog.
      event.preventDefault()
      setInstallEvent(event as BeforeInstallPromptEvent)
      appearTimer = setTimeout(() => setIsVisible(true), APPEAR_DELAY)
    }

    const onInstalled = () => {
      setIsVisible(false)
      setInstallEvent(null)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    window.addEventListener('appinstalled', onInstalled)

    return () => {
      clearTimeout(appearTimer)
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const dismiss = useCallback(() => {
    setIsVisible(false)
    snooze()
  }, [])

  const install = useCallback(async () => {
    if (!installEvent) {
      dismiss()
      return
    }

    // The captured event is single use, so hide the banner either way.
    setIsVisible(false)
    setInstallEvent(null)

    await installEvent.prompt()

    const { outcome } = await installEvent.userChoice

    if (outcome === 'dismissed') snooze()
  }, [dismiss, installEvent])

  if (!isVisible) return null

  return (
    <section
      aria-labelledby="pwa-install-title"
      className="animate-in fade-in slide-in-from-bottom-4 fixed inset-x-4 bottom-4 z-50 duration-300 md:left-auto md:w-[380px]"
    >
      <div className="bg-teal relative overflow-hidden rounded-2xl p-4 text-white shadow-xl">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Taklifni yopish"
          className="absolute top-2 right-2 rounded-full p-1.5 transition-colors hover:bg-white/15"
        >
          <X className="size-4" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/10">
            <Download className="size-6" aria-hidden="true" />
          </span>

          <div className="flex-1 pr-6">
            <h2 id="pwa-install-title" className="leading-tight font-semibold">
              Ekotizim mobil ilovasi
            </h2>
            <p className="mt-1 text-xs text-white/80">
              Tezroq ochilishi va bosh ekrandan kirish uchun ilovani o‘rnating.
            </p>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button onClick={() => void install()} className="text-teal h-9 flex-1 bg-white hover:bg-white/90">
            O‘rnatish
          </Button>
          <Button variant="ghost" onClick={dismiss} className="h-9 px-3 text-white hover:bg-white/10 hover:text-white">
            Keyinroq
          </Button>
        </div>
      </div>
    </section>
  )
}
