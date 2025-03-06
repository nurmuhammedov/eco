import authSlice from './auth-slice';
import { configureStore } from '@reduxjs/toolkit';
import uiSlice from '@/entities/ui/model/ui-slice.ts';

export const store = configureStore({
  reducer: {
    ui: uiSlice,
    auth: authSlice,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
