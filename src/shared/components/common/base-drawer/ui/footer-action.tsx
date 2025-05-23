import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/components/ui/button';
import type { DrawerFooterActionsProps } from '../types';

export const DrawerFooterActions = memo(function DrawerFooterActions({
  loading,
  onCancel,
  onSubmit,
  disabled,
  showCancel = true,
  showSubmit = true,
  submitLabel = 'actions.save',
  cancelLabel = 'actions.cancel',
}: DrawerFooterActionsProps) {
  const { t } = useTranslation('common');
  if (!showCancel && !showSubmit) return null;

  return (
    <div className="flex gap-x-4 justify-between">
      {showCancel && (
        <Button type="button" variant="outline" className="w-full" onClick={onCancel}>
          {t(cancelLabel)}
        </Button>
      )}
      {showSubmit && (
        <Button type="submit" loading={loading} className="w-full" onClick={onSubmit} disabled={disabled}>
          {t(submitLabel)}
        </Button>
      )}
    </div>
  );
});
