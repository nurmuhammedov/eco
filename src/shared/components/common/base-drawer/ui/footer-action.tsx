import { Button } from '@/shared/components/ui/button';
import type { DrawerFooterActionsProps } from '../types';

export function DrawerFooterActions({
  onCancel,
  onSubmit,
  loading,
  disabled,
  showCancel = true,
  showSubmit = true,
  submitLabel = 'Saqlash',
  cancelLabel = 'Bekor qilish',
}: DrawerFooterActionsProps) {
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
}
