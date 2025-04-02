import { MainLayout } from '@/shared/layouts';
import ErrorBoundary from '@/widgets/error-boundary';
import ProtectedRoute from '@/app/routes/protected-route';

export default function Providers() {
  return (
    <ErrorBoundary>
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    </ErrorBoundary>
  );
}
