import { StrictMode } from 'react';
import { store } from '@/app/store';
import { Provider } from 'react-redux';
import { queryClient } from '@/shared/api';
import AppRouter from './routes/AppRouter';
import { createRoot } from 'react-dom/client';
import { Toaster } from '@/shared/components/ui/sonner';
import { QueryClientProvider } from '@tanstack/react-query';
import { WithLanguage } from './providers/with-language.tsx';
import '@/app/styles/globals.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <WithLanguage>
          <AppRouter />
        </WithLanguage>
      </QueryClientProvider>
    </Provider>
    <Toaster expand />
  </StrictMode>,
);
