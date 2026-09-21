import { configureStore } from '@reduxjs/toolkit'
import uiSlice from '@/shared/store/ui-slice'
import { IS_DEV } from '@/shared/constants/general'

export const store = configureStore({
  reducer: {
    ui: uiSlice,
  },
  devTools: IS_DEV,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
