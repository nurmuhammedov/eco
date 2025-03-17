import { useCallback } from 'react';
import { RootState } from '@/app/store';
import { useSelector } from 'react-redux';
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
  return function useEntityDrawer() {
    const dispatch = useAppDispatch();

    const isOpen = useSelector<RootState, boolean>(
      (state) => state.ui.isOpen && state.ui.componentName === componentName,
    );

    const mode = useSelector<RootState, UIModeEnum | undefined>(
      (state) => state.ui.mode,
    );

    const data = useSelector<RootState, UIComponentDataMap[T] | null>(
      (state) =>
        state.ui.componentName === componentName
          ? (state.ui.data as UIComponentDataMap[T])
          : null,
    );

    const onOpen = useCallback(
      (mode: UIModeEnum, data?: UIComponentDataMap[T] | null) =>
        dispatch(openUI({ mode, componentName, data })),
      [dispatch],
    );

    const onClose = useCallback(() => dispatch(closeUI()), [dispatch]);

    return { isOpen, mode, data, onOpen, onClose };
  };
}
