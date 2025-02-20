import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApplicationType } from '@/entities/user/applications/model/application.types';

const initialState = {
  applicationType: ApplicationType.RegisterHPO,
};

export const createApplicationStore = createSlice({
  name: 'createApplication',
  initialState,
  reducers: {
    setApplicationType: (state, action: PayloadAction<ApplicationType>) => {
      return { ...state, applicationType: action.payload };
    },
  },
});

export const { setApplicationType } = createApplicationStore.actions;

export default createApplicationStore.reducer;
