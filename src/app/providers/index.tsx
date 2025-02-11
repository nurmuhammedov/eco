import { store } from '@/store';
import { Provider } from 'react-redux';
import { AppRouter } from '@/app/routes';
import { queryClient } from '@/shared/api/query-client';
import { QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from './LanguageProvider';

export default function Providers() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <AppRouter />
        </LanguageProvider>
      </QueryClientProvider>
    </Provider>
  );
}
