import { useTranslation } from 'react-i18next';
import Icon from '@/shared/components/common/icon';

export default function Error() {
  const { t } = useTranslation(['common']);
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Icon name="page-not-found" className="size-80" />
      <h2 className="text-2xl font-semibold">{t('errors.page_not_found')}</h2>
    </div>
  );
}
