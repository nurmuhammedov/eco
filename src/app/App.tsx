import { AppRouter } from '@/app/routes';
import { QueryProvider, ReduxProvider } from './providers';

export default function App() {
  return (
    <ReduxProvider>
      <QueryProvider>
        <AppRouter />
      </QueryProvider>
    </ReduxProvider>
  );
}
