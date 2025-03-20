import { Toaster } from '@/shared/components/ui/sonner';
import { PrivateLayout, ProtectedRoute } from '@/widgets';
import { Fragment } from 'react';

export default function Providers() {
  console.log('2222222888');
  return (
    <Fragment>
      <ProtectedRoute>
        <PrivateLayout />
      </ProtectedRoute>
      <Toaster />
    </Fragment>
  );
}
