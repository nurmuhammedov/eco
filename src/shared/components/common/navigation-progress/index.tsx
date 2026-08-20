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
  const { pathname } = useLocation()
  const [pendingPath, setPendingPath] = useState<string | null>(null)

  const startNavigation = useCallback((path: string) => {
    setPendingPath((current) => (current === path ? current : path))
  }, [])

  useEffect(() => {
    setPendingPath(null)
  }, [pathname])

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
