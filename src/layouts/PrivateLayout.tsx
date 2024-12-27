import { pick } from '@/shared/utils';
import { shallowEqual } from 'react-redux';
import { useAppSelector } from '@/store/hooks';
import { Navigate, Outlet } from 'react-router-dom';

export default function PrivateLayout() {
  const { isAuthenticated } = useAppSelector(
    (state) => pick(state.auth, ['isAuthenticated']),
    shallowEqual,
  );

  if (!isAuthenticated) return <Navigate to="/login" />;

  return (
    <section className="flex">
      <aside className="border-r w-1/5 h-screen">Sidebar</aside>
      <main className="h-full w-full">
        <header className="shadow bg-white p-5 rounded-md w-full">
          <nav>Navbar</nav>
        </header>
        <section>
          <Outlet />
        </section>
      </main>
    </section>
  );
}
