import { store } from '@/app/store';
import { Provider } from 'react-redux';
import { AppRouter } from '@/app/routes';
import { queryClient } from '@/shared/api';
import { LanguageProvider } from './LanguageProvider';
import { QueryClientProvider } from '@tanstack/react-query';

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
