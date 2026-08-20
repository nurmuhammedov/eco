import { toast } from 'sonner'
import { registerSW } from 'virtual:pwa-register'

const RELOAD_GUARD_KEY = 'sw-chunk-reload'

/**
 * A cached shell can point at asset hashes that no longer exist after a deploy.
 * Vite reports those as `vite:preloadError`; reloading once picks up the new shell.
 */
const reloadOnStaleChunk = () => {
  window.addEventListener('vite:preloadError', (event) => {
    if (sessionStorage.getItem(RELOAD_GUARD_KEY)) return

    event.preventDefault()
    sessionStorage.setItem(RELOAD_GUARD_KEY, '1')
    window.location.reload()
  })

  window.addEventListener('load', () => sessionStorage.removeItem(RELOAD_GUARD_KEY))
}

export const setupServiceWorker = () => {
  reloadOnStaleChunk()

  const updateServiceWorker = registerSW({
    immediate: true,
    onNeedRefresh() {
      toast.info('Tizimning yangi versiyasi mavjud', {
        description: 'Oxirgi o‘zgarishlarni ko‘rish uchun sahifani yangilang.',
        duration: Infinity,
        closeButton: true,
        action: {
          label: 'Yangilash',
          onClick: () => void updateServiceWorker(true),
        },
      })
    },
  })
}
