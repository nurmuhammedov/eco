import { memo } from 'react';
import { Button } from '@/shared/components/ui/button';
import { ActionButtonProps } from '@/widgets/admin/regions-management/types';

export const ActionButton = memo(
  ({ title, activeTab, onAddRegion, onAddDistrict }: ActionButtonProps) => {
    return (
      <div className="flex justify-between">
        <h5 className="text-2xl font-semibold uppercase">{title}</h5>
        {activeTab === 'regions' ? (
          <Button onClick={onAddRegion}>Вилоят қўшиш</Button>
        ) : (
          <Button onClick={onAddDistrict}>Туман қўшиш</Button>
        )}
      </div>
    );
  },
);
ActionButton.displayName = 'ActionButton';
