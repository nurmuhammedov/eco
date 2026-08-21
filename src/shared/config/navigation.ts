/**
 * Where unauthenticated visitors are sent.
 * Production serves the public landing page at `/` from nginx, while dev and test
 * builds have no landing page and go straight to the admin login form.
 */
export const GUEST_LANDING_PATH: string =
  import.meta.env.VITE_GUEST_LANDING_PATH || (import.meta.env.DEV ? '/auth/login/admin' : '/')

/** The landing page is a separate nginx-served document, so it needs a full browser navigation. */
export const IS_STATIC_LANDING = GUEST_LANDING_PATH === '/'

/** Marks that the pre-`/`-landing service workers have already been cleared in this browser. */
const SW_MIGRATION_KEY = 'landing-sw-cleared'
const SW_CLEANUP_TIMEOUT_MS = 1500

let isNavigatingAway = false

export const isAtGuestLanding = (): boolean => window.location.pathname === GUEST_LANDING_PATH

const readMigrationFlag = (): boolean => {
  try {
    return localStorage.getItem(SW_MIGRATION_KEY) === '1'
  } catch {
    return false
  }
}

const writeMigrationFlag = (): void => {
  try {
    localStorage.setItem(SW_MIGRATION_KEY, '1')
  } catch {
    // Private mode: the cleanup simply runs again next time.
  }
}

/**
 * Service workers registered before the landing page moved to `/` answer that
 * navigation from the cached SPA shell, so the visitor never reaches the landing
 * page. Current builds deny `/` in `navigateFallbackDenylist`, which means this
 * cleanup only has to happen once per browser.
 */
const clearOutdatedServiceWorkers = (): Promise<void> => {
  if (!IS_STATIC_LANDING || !('serviceWorker' in navigator) || readMigrationFlag()) {
    return Promise.resolve()
  }

  const cleanup = navigator.serviceWorker
    .getRegistrations()
    .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())))
    .then(writeMigrationFlag)
    .catch(() => undefined)

  // Never let an unresponsive service worker keep a signed-out user on a dead page.
  const timeout = new Promise<void>((resolve) => setTimeout(resolve, SW_CLEANUP_TIMEOUT_MS))

  return Promise.race([cleanup, timeout])
}

export const goToGuestLanding = (): void => {
  // Reloading while the app is already sitting on the landing path would just
  // restart this same code, so leaving is the only thing this function may do.
  if (isNavigatingAway || isAtGuestLanding()) return

  isNavigatingAway = true

  const leave = () => window.location.replace(GUEST_LANDING_PATH)

  void clearOutdatedServiceWorkers().then(leave, leave)
}
