import { Fragment } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const isAuthenticated = true; // Replace with real authentication logic

export default function PrivateLayout() {
  if (!isAuthenticated) return <Navigate to="/login" />;
  return (
    <Fragment>
      <header>Private Header</header>
      <main>
        <Outlet />
      </main>
    </Fragment>
  );
}
