import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocation } from 'react-router-dom'

interface NavigationProgressValue {
  pendingPath: string | null
  startNavigation: (path: string) => void
}

const NavigationProgressContext = createContext<NavigationProgressValue>({
  pendingPath: null,
  startNavigation: () => {},
})

export const useNavigationProgress = () => useContext(NavigationProgressContext)

/**
 * React Router runs navigations inside `startTransition`, so React keeps the previous
 * page on screen while a lazy chunk downloads and never shows the Suspense fallback.
 * On a slow connection that looks like the click did nothing, so the click itself
 * flips a flag that is cleared once the new route commits.
 */
export const NavigationProgressProvider = ({ children }: PropsWithChildren) => {
  const { pathname, search, key } = useLocation()
  const [pendingPath, setPendingPath] = useState<string | null>(null)

  const current = `${pathname}${search}`

  /**
   * Menu entries carry a query string, so a click can land on the URL already
   * showing - the same section from a different tab, or the same link twice.
   * Nothing then changes for the bar to react to, so it never starts.
   */
  const startNavigation = useCallback(
    (path: string) => {
      if (path === current || path === pathname) return

      setPendingPath((pending) => (pending === path ? pending : path))
    },
    [current, pathname]
  )

  // `search` and `key` belong here beside `pathname`: a navigation that only
  // changes the query left the bar running with nothing left to clear it.
  useEffect(() => {
    setPendingPath(null)
  }, [pathname, search, key])

  /**
   * Last resort. A route that redirects back where it came from, or a chunk
   * that never resolves, would otherwise leave the bar animating for the rest
   * of the session - it is a hint that something is loading, not a promise.
   */
  useEffect(() => {
    if (pendingPath === null) return

    const timer = setTimeout(() => setPendingPath(null), 10_000)

    return () => clearTimeout(timer)
  }, [pendingPath])

  const value = useMemo(() => ({ pendingPath, startNavigation }), [pendingPath, startNavigation])

  return (
    <NavigationProgressContext.Provider value={value}>
      {children}
      {pendingPath !== null &&
        createPortal(
          <div role="progressbar" aria-label="Sahifa yuklanmoqda" className="fixed inset-x-0 top-0 z-[100] h-0.5">
            <div className="bg-teal animate-route-progress h-full origin-left" />
          </div>,
          document.body
        )}
    </NavigationProgressContext.Provider>
  )
}
