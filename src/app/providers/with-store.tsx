import React from 'react';
import { store } from '@/app/store';
import { Provider } from 'react-redux';

export const withStore = (Component: React.ComponentType) => {
  return function WithStoreProvider(props: any) {
    return (
      <Provider store={store}>
        <Component {...props} />
      </Provider>
    );
  };
};
