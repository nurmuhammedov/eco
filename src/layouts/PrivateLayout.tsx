import { Fragment } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const isAuthenticated = true;

export default function PrivateLayout() {
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
