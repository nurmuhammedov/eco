import { useSelector } from 'react-redux';
import { closeUI, openUI } from '../model/ui-slice';
import { useAppDispatch } from '@/shared/hooks/use-store';
import { UIComponentName, UIModeEnum } from '@/shared/types/ui-types';
import {
  selectIsOpen,
  selectUIComponentName,
  selectUIData,
  selectUIMode,
} from '../model/ui-selectors';

export const useUI = () => {
  const dispatch = useAppDispatch();
  const data = useSelector(selectUIData);
  const isOpen = useSelector(selectIsOpen);
  const mode = useSelector(selectUIMode);
  const componentName = useSelector(selectUIComponentName);

  const onOpen = (
    mode: UIModeEnum,
    componentName: UIComponentName,
    data?: any,
  ) => {
    dispatch(openUI({ mode, componentName, data }));
  };

  const onClose = () => {
    dispatch(closeUI());
  };

  return { isOpen, mode, componentName, data, onOpen, onClose };
};
