import { memo } from 'react';
import { ActionButtonProps } from '../types';
import { Button } from '@/shared/components/ui/button';
import { useTranslation } from 'react-i18next';

export const ActionButton = memo(
  ({ title, activeTab, onAddRegion, onAddDistrict }: ActionButtonProps) => {
    const { t } = useTranslation('common');
    return (
      <div className="flex justify-between">
        <h5 className="text-2xl font-semibold uppercase">{title}</h5>
        {activeTab === 'regions' ? (
          <Button onClick={onAddRegion}>{t('actions.add_region')}</Button>
        ) : (
          <Button onClick={onAddDistrict}>{t('actions.add_district')}</Button>
        )}
      </div>
    );
  },
);
ActionButton.displayName = 'ActionButton';
