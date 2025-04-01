import { ProtectedRoute } from '@/widgets';
import { MainLayout } from '@/shared/layouts';
import ErrorBoundary from '@/widgets/error-boundary';

export default function Providers() {
  return (
    <ErrorBoundary>
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    </ErrorBoundary>
  );
}
