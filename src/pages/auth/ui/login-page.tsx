import LoginForm from '@/features/auth/ui/one-id-login.tsx';
import LoginInfoSection from '@/features/auth/ui/login-info-section';

export default function LoginPage() {
  return (
    <section className="flex h-screen">
      <LoginInfoSection />
      <LoginForm />
    </section>
  );
}
