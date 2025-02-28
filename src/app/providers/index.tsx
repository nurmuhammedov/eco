import { store } from '@/app/store';
import { Provider } from 'react-redux';
import { AppRouter } from '@/app/routes';
import { queryClient } from '@/shared/api';
import { LanguageProvider } from './LanguageProvider';
import { QueryClientProvider } from '@tanstack/react-query';
import ErrorBoundary from '@/pages/error/ui/error-boundary';

export default function Providers() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <LanguageProvider>
            <AppRouter />
          </LanguageProvider>
        </QueryClientProvider>
      </Provider>
    </ErrorBoundary>
  );
}
