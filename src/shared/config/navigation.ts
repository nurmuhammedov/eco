/**
 * Where unauthenticated visitors are sent.
 * Production serves the public landing page at `/` from nginx, while dev and test
 * builds have no landing page and go straight to the admin login form.
 */
export const GUEST_LANDING_PATH: string =
  import.meta.env.VITE_GUEST_LANDING_PATH || (import.meta.env.DEV ? '/auth/login/admin' : '/')

/** The landing page is a separate nginx-served document, so it needs a full browser navigation. */
export const IS_STATIC_LANDING = GUEST_LANDING_PATH === '/'

/**
 * Bumped whenever a service worker release could still be answering `/` with the
 * SPA shell, so the cleanup below runs once more for browsers that already ran it.
 */
const SW_CLEANUP_KEY = 'landing-sw-cleared-v2'
const SW_CLEANUP_TIMEOUT_MS = 1500
/** Session-scoped so a shell that keeps hijacking `/` can never reload in a loop. */
const STRANDED_ESCAPE_KEY = 'landing-escape-attempted'

let isNavigatingAway = false

export const isAtGuestLanding = (): boolean => window.location.pathname === GUEST_LANDING_PATH

const readFlag = (storage: Storage, key: string): boolean => {
  try {
    return storage.getItem(key) === '1'
  } catch {
    return false
  }
}

const writeFlag = (storage: Storage, key: string): void => {
  try {
    storage.setItem(key, '1')
  } catch {
    // Private mode: the guard simply does not persist.
  }
}

const unregisterServiceWorkers = (): Promise<void> => {
  const cleanup = navigator.serviceWorker
    .getRegistrations()
    .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())))
    .then(() => undefined)
    .catch(() => undefined)

  // Never let an unresponsive service worker strand the visitor on a dead page.
  const timeout = new Promise<void>((resolve) => setTimeout(resolve, SW_CLEANUP_TIMEOUT_MS))

  return Promise.race([cleanup, timeout])
}

/**
 * Older releases precached `index.html` with workbox's default `directoryIndex`,
 * so their service worker answers `/` with the SPA shell and the visitor never
 * reaches the landing page. Clearing it once per browser is enough.
 */
const clearOutdatedServiceWorkers = (): Promise<void> => {
  if (!IS_STATIC_LANDING || !('serviceWorker' in navigator) || readFlag(localStorage, SW_CLEANUP_KEY)) {
    return Promise.resolve()
  }

  return unregisterServiceWorkers().then(() => writeFlag(localStorage, SW_CLEANUP_KEY))
}

export const goToGuestLanding = (): void => {
  // Reloading while the app already sits on the landing path would restart this
  // same code, so leaving is the only thing this function may do.
  if (isNavigatingAway || isAtGuestLanding()) return

  isNavigatingAway = true

  const leave = () => window.location.replace(GUEST_LANDING_PATH)

  void clearOutdatedServiceWorkers().then(leave, leave)
}

/**
 * The SPA booted on the landing path, which means a cached shell answered the
 * navigation instead of the server. Dropping the service worker and reloading
 * brings up the real landing page. Returns `false` once it has already been
 * tried in this tab, so the caller can render something instead of looping.
 */
export const escapeStrandedLanding = (): boolean => {
  if (!IS_STATIC_LANDING || readFlag(sessionStorage, STRANDED_ESCAPE_KEY)) return false

  writeFlag(sessionStorage, STRANDED_ESCAPE_KEY)

  const reload = () => window.location.reload()

  if ('serviceWorker' in navigator) void unregisterServiceWorkers().then(reload, reload)
  else reload()

  return true
}
