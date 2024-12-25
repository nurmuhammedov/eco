import { AppRouter } from '@/app/routes';
import { QueryProvider } from './providers';

export default function App() {
  return (
    <QueryProvider>
      <AppRouter />
    </QueryProvider>
  );
}
