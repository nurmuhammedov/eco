import { lazy } from 'react';

const RegisterWidget = lazy(() => import('@/widgets/register/ui/register-widget'));

export default function RegisterPage() {
  return <RegisterWidget />;
}
