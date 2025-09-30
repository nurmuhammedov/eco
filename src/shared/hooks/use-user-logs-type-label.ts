import { useTranslation } from 'react-i18next';
import { UserLogsTypeEnum } from '@/entities/admin/user-logs';

export const useUserLogsTypeLabel = () => {
  const { t } = useTranslation();

  return (type: UserLogsTypeEnum | null | undefined): string => {
    if (!type) return '-';
    return t(`user-logs.${type}`);
  };
};
