import { useCallback, useState } from 'react';
import { DrawerMode } from '@/shared/types/enums';

export const useDrawer = <T>() => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<DrawerMode>();
  const [data, setData] = useState<Partial<T> | undefined>(undefined);

  const openDrawer = useCallback((mode: DrawerMode, data?: Partial<T>) => {
    setIsOpen(true);
    setMode(mode);
    setData(data);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsOpen(false);
    setMode(undefined);
    setData(undefined);
  }, []);

  return { isOpen, mode, data, openDrawer, closeDrawer };
};
