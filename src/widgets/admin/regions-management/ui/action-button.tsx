import { memo } from 'react';
import { PlusCircle } from 'lucide-react';
import { ActionButtonProps } from '../types';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/components/ui/button';

export const ActionButton = memo(
  ({ title, activeTab, onAddRegion, onAddDistrict }: ActionButtonProps) => {
    const { t } = useTranslation('common');
    return (
      <div className="flex justify-between">
        <h5 className="text-2xl font-semibold uppercase">{title}</h5>
        {activeTab === 'regions' ? (
          <Button onClick={onAddRegion}>
            <PlusCircle />
            {t('actions.add_region')}
          </Button>
        ) : (
          <Button onClick={onAddDistrict}>
            <PlusCircle /> {t('actions.add_district')}
          </Button>
        )}
      </div>
    );
  },
);
ActionButton.displayName = 'ActionButton';
