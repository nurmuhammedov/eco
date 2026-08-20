/**
 * Where unauthenticated visitors are sent.
 * Production serves the public landing page at `/` from nginx, while dev and test
 * builds have no landing page and go straight to the admin login form.
 */
export const GUEST_LANDING_PATH: string =
  import.meta.env.VITE_GUEST_LANDING_PATH || (import.meta.env.DEV ? '/auth/login/admin' : '/')

/** The landing page is a separate nginx-served document, so it needs a full browser navigation. */
export const IS_STATIC_LANDING = GUEST_LANDING_PATH === '/'

export const goToGuestLanding = (): void => {
  const { pathname, search } = window.location

  if (pathname === GUEST_LANDING_PATH || `${pathname}${search}` === GUEST_LANDING_PATH) return

  window.location.replace(GUEST_LANDING_PATH)
}
