import AdminLoginForm from '@/features/auth/ui/admin-login';
import LoginInfoSection from '@/features/auth/ui/login-info-section';

export default function AdminLoginPage() {
  return (
    <section className="flex h-screen">
      <LoginInfoSection />
      <AdminLoginForm />
    </section>
  );
}
