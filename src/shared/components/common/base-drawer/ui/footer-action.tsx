import { memo } from 'react';
import { Button } from '@/shared/components/ui/button';
import type { DrawerFooterActionsProps } from '../types';

export const DrawerFooterActions = memo(function DrawerFooterActions({
  loading,
  onCancel,
  onSubmit,
  disabled,
  showCancel = true,
  showSubmit = true,
  submitLabel = 'Saqlash',
  cancelLabel = 'Bekor qilish',
}: DrawerFooterActionsProps) {
  if (!showCancel && !showSubmit) return null;

  return (
    <div className="flex gap-x-4 justify-between">
      {showCancel && (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onCancel}
        >
          {cancelLabel}
        </Button>
      )}
      {showSubmit && (
        <Button
          type="submit"
          loading={loading}
          className="w-full"
          onClick={onSubmit}
          disabled={disabled}
        >
          {submitLabel}
        </Button>
      )}
    </div>
  );
});
