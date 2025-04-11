import React from 'react';
import { ErrorBoundary } from '@/widgets/error-boundary';

export const withErrorBoundary = (Component: React.ComponentType) => {
  return function WithErrorBoundary(props: any) {
    return (
      <ErrorBoundary>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
};
