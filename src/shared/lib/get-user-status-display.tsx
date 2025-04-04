import { useTranslation } from 'react-i18next';
import { Badge } from '../components/ui/badge';

export const getUserStatusDisplay = (status: boolean) => {
  const { t } = useTranslation('common');
  return status ? (
    <Badge className="bg-emerald-600/10 text-emerald-500 shadow-none px-4 py-1.5">
      {t('in_work')}
    </Badge>
  ) : (
    <Badge className="bg-red-600/10 text-red-500 shadow-none px-4 py-1.5">
      {t('not_in_work')}
    </Badge>
  );
};
