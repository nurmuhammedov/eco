import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApplicationTypeEnum } from '@/entities/user/applications/model/application.types';

const initialState = {
  applicationType: ApplicationTypeEnum.RegisterHPO,
};

export const createApplicationStore = createSlice({
  name: 'createApplication',
  initialState,
  reducers: {
    setApplicationType: (state, action: PayloadAction<ApplicationTypeEnum>) => {
      return { ...state, applicationType: action.payload };
    },
  },
});

export const { setApplicationType } = createApplicationStore.actions;

export default createApplicationStore.reducer;
