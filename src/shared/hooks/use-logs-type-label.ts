import { useTranslation } from 'react-i18next';
import { LogTypeEnum } from '@/entities/admin/logs';

export const useLogsTypeLabel = () => {
  const { t } = useTranslation();

  return (type: LogTypeEnum | null | undefined): string => {
    if (!type) return '-';
    return t(`logs_type.${type}`);
  };
};
