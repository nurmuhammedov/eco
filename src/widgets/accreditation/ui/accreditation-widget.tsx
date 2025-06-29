import { AccreditationList } from '@/features/accreditation/ui/accreditation-list';
import { useTranslation } from 'react-i18next';

export const AccreditationWidget = () => {
  const { t } = useTranslation('common');

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">{t('menu.accreditation')}</h1>
      </div>
      <AccreditationList />
    </div>
  );
};
