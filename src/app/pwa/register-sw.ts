import { registerSW } from 'virtual:pwa-register'

const RELOAD_GUARD_KEY = 'sw-chunk-reload'

/**
 * A cached shell can point at asset hashes that no longer exist after a deploy.
 * Vite reports those as `vite:preloadError`; reloading once picks up the new shell.
 * This only covers chunks imported after start-up - a missing entry script is
 * caught by the recovery guard in index.html, which runs without the bundle.
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

  // The worker skips waiting and claims its clients, so there is no update to
  // prompt for: the next navigation is already served by the new release.
  registerSW({ immediate: true })
}
