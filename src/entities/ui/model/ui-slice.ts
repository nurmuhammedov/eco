import type { PayloadUI, UIState } from '../types/ui-types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: UIState = {
  isOpen: false,
  mode: undefined,
  name: undefined,
  data: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openUI: (state, action: PayloadAction<PayloadUI<any>>) => {
      state.isOpen = true;
      state.mode = action.payload.mode;
      state.name = action.payload.name;
      state.data = action.payload.data;
    },
    closeUI: (state) => {
      state.isOpen = false;
      state.mode = undefined;
      state.name = undefined;
      state.data = undefined;
    },
  },
});

export const { openUI, closeUI } = uiSlice.actions;
export default uiSlice.reducer;
