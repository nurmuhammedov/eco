import { Toaster } from '@/shared/components/ui/sonner';
import { PrivateLayout, ProtectedRoute } from '@/widgets';
import ErrorBoundary from '@/pages/error/ui/error-boundary';

export default function Providers() {
  return (
    <ErrorBoundary>
      <ProtectedRoute>
        <PrivateLayout />
      </ProtectedRoute>
      <Toaster expand />
    </ErrorBoundary>
  );
}
