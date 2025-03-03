import { useCallback, useState } from 'react';
import { DrawerMode } from '@/shared/types/enums';

// ✅ Generic Hook
export const useDrawer = <T>() => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<DrawerMode>();
  const [data, setData] = useState<Partial<T> | undefined>(undefined);

  // ✅ Drawer'ni ochish
  const openDrawer = useCallback((mode: DrawerMode, data?: Partial<T>) => {
    setIsOpen(true);
    setMode(mode);
    setData(data);
  }, []);

  // ✅ Drawer'ni yopish
  const closeDrawer = useCallback(() => {
    setIsOpen(false);
    setMode(undefined);
    setData(undefined);
  }, []);

  return { isOpen, mode, data, openDrawer, closeDrawer };
};
