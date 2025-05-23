import { Outlet } from 'react-router-dom';
import { LoginInfoSection } from '@/features/auth';

export default function AuthLayout() {
  return (
    <section className="flex h-screen">
      <LoginInfoSection />
      <Outlet />
    </section>
  );
}
