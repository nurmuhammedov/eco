import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/app/styles/globals.css';
import AppRouter from './routes/AppRouter.tsx';
import { store } from '@/app/store';
import { queryClient } from '@/shared/api';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from './providers/LanguageProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <AppRouter />
        </LanguageProvider>
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
);
