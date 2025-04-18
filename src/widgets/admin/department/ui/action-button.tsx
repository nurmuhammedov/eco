import { memo } from 'react';
import { PlusCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/components/ui/button';
import { DepartmentActionButtonProps, DepartmentActiveTab } from '../types';

export const DepartmentActionButton = memo(
  ({ title, activeTab, onAddApparatus, onAddDepartment }: DepartmentActionButtonProps) => {
    const { t } = useTranslation('common');
    return (
      <div className="flex justify-between">
        <h5 className="text-2xl font-semibold uppercase">{title}</h5>
        {activeTab === DepartmentActiveTab.CENTRAL_APPARATUS ? (
          <Button onClick={onAddApparatus}>
            <PlusCircle />
            {t('actions.add_central_apparatus')}
          </Button>
        ) : (
          <Button onClick={onAddDepartment}>
            <PlusCircle /> {t('actions.add_territorial_department')}
          </Button>
        )}
      </div>
    );
  },
);
DepartmentActionButton.displayName = 'DepartmentActionButton';
