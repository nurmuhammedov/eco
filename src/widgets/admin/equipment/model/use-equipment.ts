import { useCallback } from 'react';
import { UIModeEnum } from '@/shared/types/ui-types';
import { useEquipmentDrawer } from '@/shared/hooks/entity-hooks';

export const useEquipment = () => {
  const { onOpen: openEquipmentDrawer, isOpen: isOpenEquipment } = useEquipmentDrawer();

  const onAddEquipment = useCallback(() => {
    openEquipmentDrawer(UIModeEnum.CREATE);
  }, [openEquipmentDrawer]);

  return { onAddEquipment, isOpenEquipment };
};
