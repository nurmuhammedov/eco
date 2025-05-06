import { useTranslation } from 'react-i18next';
import { EquipmentTypeEnum } from '@/entities/admin/equipment';

export const useEquipmentTypeLabel = () => {
  const { t } = useTranslation();

  return (type: EquipmentTypeEnum | null | undefined): string => {
    if (!type) return '-';
    return t(`equipment_types.${type}`);
  };
};
