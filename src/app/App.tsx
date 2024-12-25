import { router } from './routes';
import { QueryProvider } from './providers';
import { RouterProvider } from 'react-router-dom';

export default function App() {
  return (
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  );
}
