import { RootState } from '@/app/store';
import { createSelector } from '@reduxjs/toolkit';

export const selectUIState = (state: RootState) => state.ui;

export const selectIsOpen = createSelector(selectUIState, (ui) => ui.isOpen);
export const selectUIMode = createSelector(selectUIState, (ui) => ui.mode);
export const selectUIComponentName = createSelector(
  selectUIState,
  (ui) => ui.componentName,
);
export const selectUIData = createSelector(selectUIState, (ui) => ui.data);
