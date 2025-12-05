import { Outlet } from 'react-router-dom'
import { LoginInfoSection } from '@/features/auth'

export default function AuthLayout() {
  return (
    <section className="flex flex-col lg:flex-row">
      <LoginInfoSection />
      <Outlet />
    </section>
  )
}
