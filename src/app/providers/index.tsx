import { store } from '@/app/store';
import { Provider } from 'react-redux';
import { AppRouter } from '@/app/routes';
import { queryClient } from '@/shared/api';
import { QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from './LanguageProvider';
import ErrorBoundary from '@/pages/error/ui/error-boundary';

export default function Providers() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <LanguageProvider>
            <AppRouter />
          </LanguageProvider>
        </ErrorBoundary>
      </QueryClientProvider>
    </Provider>
  );
}
