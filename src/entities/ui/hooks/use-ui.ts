import { useDispatch, useSelector } from 'react-redux';
import { closeUI, openUI } from '../model/ui-slice';
import {
  selectIsOpen,
  selectUIData,
  selectUIMode,
  selectUIName,
} from '../model/ui-selectors';
import { UIModeEnum } from '../types/ui-types';

export const useUI = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector(selectIsOpen);
  const mode = useSelector(selectUIMode);
  const name = useSelector(selectUIName);
  const data = useSelector(selectUIData);

  const onOpen = (mode: UIModeEnum, name: string, data?: any) => {
    dispatch(openUI({ mode, name, data }));
  };

  const onClose = () => {
    dispatch(closeUI());
  };

  return { isOpen, mode, name, data, onOpen, onClose };
};
