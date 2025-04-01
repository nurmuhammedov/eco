import React from 'react';
import { BrowserRouter } from 'react-router-dom';

export const withRouter = (Component: React.ComponentType) => {
  return function WithRouterProvider(props: any) {
    return (
      <BrowserRouter>
        <Component {...props} />
      </BrowserRouter>
    );
  };
};
