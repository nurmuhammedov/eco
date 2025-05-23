import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { withProviders } from '@/app/providers';
import '@/app/styles/globals.css';

export const App = () => null; // Actual content will be rendered via router provider

const AppWithProviders = withProviders(App);
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <AppWithProviders />
    </StrictMode>,
  );
}
