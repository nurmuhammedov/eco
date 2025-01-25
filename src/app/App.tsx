import { AppRouter } from '@/app/routes';
import { LanguageProvider, QueryProvider, ReduxProvider } from './providers';

export default function App() {
  return (
    <ReduxProvider>
      <QueryProvider>
        <LanguageProvider>
          <AppRouter />
        </LanguageProvider>
      </QueryProvider>
    </ReduxProvider>
  );
}
