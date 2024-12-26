import { Fragment } from 'react';
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
    <Fragment>
      <header className="shadow bg-white p-5 rounded-md w-full">
        <nav>
          <ul className="flex gap-4">
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              <a href="#">About</a>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </Fragment>
  );
}
