import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/app/styles/globals.css';
import AppRouter from './routes/AppRouter.tsx';
import { store } from '@/app/store';
import { queryClient } from '@/shared/api';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from './providers/LanguageProvider';
import { LoaderProvider } from '@/shared/components/common/global-loader/ui';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <LoaderProvider>
        <QueryClientProvider client={queryClient}>
          <LanguageProvider>
            <AppRouter />
          </LanguageProvider>
        </QueryClientProvider>
      </LoaderProvider>
    </Provider>
  </StrictMode>,
);
