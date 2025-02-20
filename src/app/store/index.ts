import authSlice from './auth-slice';
import { configureStore } from '@reduxjs/toolkit';
import createApplication from '@/features/user/applications/create-application/models/create-application.store';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    createApplication,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
