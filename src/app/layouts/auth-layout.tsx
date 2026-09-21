import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { LoginInfoSection } from '@/features/auth'

export default function AuthLayout() {
  /**
   * The application shell is a lazy chunk, so signing in used to mean watching a
   * boot screen while it downloaded - after the wait for the sign-in itself.
   * Fetching it while the user is still reading the form makes that step
   * disappear; a failed prefetch costs nothing, the real import retries.
   */
  useEffect(() => {
    void import('@/app/layouts/app-layout')
  }, [])

  return (
    <section className="flex min-h-screen flex-col lg:flex-row">
      <LoginInfoSection />
      <Outlet />
    </section>
  )
}
