import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadUI, UIComponentName, UIState } from '@/shared/types/ui-types';

const initialState: UIState = {
  isOpen: false,
  mode: undefined,
  componentName: undefined,
  data: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openUI(state, action: PayloadAction<PayloadUI<any>>) {
      state.isOpen = true;
      state.mode = action.payload.mode;
      state.data = action.payload.data ?? null;
      state.componentName = action.payload.componentName;
    },
    closeUI(state) {
      state.isOpen = false;
      state.mode = undefined;
      state.componentName = undefined;
      state.data = null;
    },
  },
});

export const openUIAction = <T extends UIComponentName>(payload: PayloadUI<T>) => uiSlice.actions.openUI(payload);

export const { closeUI } = uiSlice.actions;
export const openUI = openUIAction; // Export with the properly typed wrapper
export default uiSlice.reducer;
