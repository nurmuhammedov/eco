import { memo } from 'react';
import { PlusCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/components/ui/button';
import {
  HazardousFacilityActiveTab,
  HazardousFacilityActiveTabActionButtonProps,
} from '../types';

export const HazardousFacilityActionButton = memo(
  ({
    title,
    activeTab,
    onAddHazardousFacilityType,
  }: HazardousFacilityActiveTabActionButtonProps) => {
    const { t } = useTranslation('common');
    return (
      <div className="flex justify-between">
        <h5 className="text-2xl font-semibold uppercase">{title}</h5>
        {activeTab === HazardousFacilityActiveTab.HAZARDOUS_FACILITY_TYPE ? (
          <Button onClick={onAddHazardousFacilityType}>
            <PlusCircle />
            {t('actions.add_hazardous_facility_type')}
          </Button>
        ) : (
          <Button onClick={() => {}}>
            <PlusCircle /> {t('actions.add_territorial_staff')}
          </Button>
        )}
      </div>
    );
  },
);
HazardousFacilityActionButton.displayName = 'HazardousFacilityActionButton';
