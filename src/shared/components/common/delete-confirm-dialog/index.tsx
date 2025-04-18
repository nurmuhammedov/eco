import { cn } from '@/shared/lib/utils';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonProps } from '@/shared/components/ui/button';
import { Loader2, OctagonAlert, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/components/ui/alert-dialog';

type DialogSize = 'sm' | 'md' | 'lg' | 'xl';

export interface DeleteConfirmationDialogProps {
  title?: string;
  isOpen?: boolean;
  disabled?: boolean;
  cancelText?: string;
  description?: string;
  confirmText?: string;
  loadingText?: string;
  onCancel?: () => void;
  dialogSize?: DialogSize;
  trigger?: React.ReactNode;
  contentClassName?: string;
  icon?: React.ReactElement;
  variant?: ButtonProps['variant'];
  onConfirm: () => Promise<void> | void;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  title = 'confirmation.are_you_sure_to_delete',
  description = 'confirmation.delete_description',
  cancelText = 'actions.cancel',
  confirmText = 'actions.delete',
  loadingText = 'actions.deleting',
  icon = <OctagonAlert className="size-5" />,
  onConfirm,
  onCancel,
  isOpen,
  setIsOpen,
  disabled = false,
  dialogSize = 'md',
  contentClassName = '',
}) => {
  const { t } = useTranslation('common');
  const [internalLoading, setInternalLoading] = useState<boolean>(false);

  const dialogProps = isOpen !== undefined && setIsOpen ? { open: isOpen, onOpenChange: setIsOpen } : {};

  const handleConfirm = async () => {
    if (!onConfirm) return;

    setInternalLoading(true);

    try {
      await Promise.resolve(onConfirm());
      if (setIsOpen) {
        setIsOpen(false);
      }
    } catch (_err) {
      setInternalLoading(false);
      // An error occurred during deletion
    } finally {
      setInternalLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    if (setIsOpen) {
      setIsOpen(false);
    }
  };

  // Calculate dialog size class
  const sizeClassMap: Record<DialogSize, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };
  const sizeClass = sizeClassMap[dialogSize] || sizeClassMap.md;

  return (
    <AlertDialog {...dialogProps}>
      <AlertDialogTrigger asChild disabled={disabled}>
        <button
          type="button"
          aria-label="Delete"
          className={cn(
            'p-1 flex items-center justify-center rounded transition-colors',
            'focus:outline-none hover:bg-neutral-250',
          )}
        >
          <span className="size-5 flex items-center justify-center">
            <Trash2 className="size-4" />
          </span>
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className={`${sizeClass} ${contentClassName}`}>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <div
              className={`mx-auto sm:mx-0 mb-4 flex size-9 items-center justify-center rounded-full bg-destructive/10`}
            >
              {React.cloneElement(icon, {
                className: `${icon.props.className} text-destructive`,
              })}
            </div>
            {t(title)}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">{t(description)}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel} disabled={internalLoading}>
            {t(cancelText)}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={internalLoading}
            className="bg-destructive hover:bg-destructive/90"
          >
            {internalLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                {t(loadingText)}
              </span>
            ) : (
              t(confirmText)
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmationDialog;
