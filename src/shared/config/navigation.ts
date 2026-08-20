/**
 * Where unauthenticated visitors are sent.
 * Production serves the public landing page at `/` from nginx, while dev and test
 * builds have no landing page and go straight to the admin login form.
 */
export const GUEST_LANDING_PATH: string =
  import.meta.env.VITE_GUEST_LANDING_PATH || (import.meta.env.DEV ? '/auth/login/admin' : '/')

/** The landing page is a separate nginx-served document, so it needs a full browser navigation. */
export const IS_STATIC_LANDING = GUEST_LANDING_PATH === '/'

let isNavigatingAway = false

export const goToGuestLanding = (): void => {
  if (isNavigatingAway) return
  isNavigatingAway = true

  const navigate = () => {
    if (window.location.pathname === GUEST_LANDING_PATH) {
      window.location.reload()
    } else {
      window.location.replace(GUEST_LANDING_PATH)
    }
  }

  if (IS_STATIC_LANDING && 'serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((regs) => {
      Promise.all(regs.map((r) => r.unregister())).then(navigate)
    })
  } else {
    navigate()
  }
}
