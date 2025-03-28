import { useCallback } from 'react';
import { RootState } from '@/app/store';
import { useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import { useAppDispatch } from '@/shared/hooks/use-store';
import { closeUI, openUI } from '@/entities/ui/model/ui-slice';
import {
  UIComponentDataMap,
  UIComponentName,
  UIModeEnum,
} from '@/shared/types/ui-types';

export function createEntityDrawerHook<T extends UIComponentName>(
  componentName: T,
) {
  const selectIsOpen = createSelector(
    [
      (state: RootState) => state.ui.isOpen,
      (state: RootState) => state.ui.componentName,
    ],
    (isOpen, currentComponentName) =>
      isOpen && currentComponentName === componentName,
  );

  const selectMode = createSelector(
    [(state: RootState) => state.ui],
    (ui) => ui.mode,
  );

  const selectData = createSelector(
    [
      (state: RootState) => state.ui.data,
      (state: RootState) => state.ui.componentName,
    ],
    (data, currentComponentName) =>
      currentComponentName === componentName
        ? (data as UIComponentDataMap[T])
        : undefined,
  );

  return function useEntityDrawer() {
    const dispatch = useAppDispatch();

    const isOpen = useSelector(selectIsOpen);
    const mode = useSelector(selectMode);
    const data = useSelector(selectData);

    const onOpen = useCallback(
      (mode: UIModeEnum, data?: UIComponentDataMap[T]) => {
        if (!mode) {
          console.warn('Mode is required when opening UI component');
          return;
        }
        dispatch(openUI({ mode, componentName, data }));
      },
      [dispatch],
    );

    const onClose = useCallback(() => dispatch(closeUI()), [dispatch]);

    const isCreate = mode === UIModeEnum.CREATE;

    return { isOpen, mode, data, onOpen, onClose, isCreate };
  };
}
