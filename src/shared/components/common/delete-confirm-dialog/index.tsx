import { cn } from '@/shared/lib/utils';
import React, { useState } from 'react';
import { Loader2, OctagonAlert, Trash2 } from 'lucide-react';
import { ButtonProps } from '@/shared/components/ui/button';
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
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  cancelText?: string;
  confirmText?: string;
  loadingText?: string;
  variant?: ButtonProps['variant'];
  icon?: React.ReactElement;
  onConfirm: () => Promise<void> | void;
  onCancel?: () => void;
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  disabled?: boolean;
  dialogSize?: DialogSize;
  itemName?: string;
  contentClassName?: string;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  title = "O'chirishni tasdiqlaysizmi?",
  description = "Ushbu amalni tasdiqlash orqali ma'lumot serverdan o'chiriladi.",
  cancelText = 'Bekor qilish',
  confirmText = "O'chirish",
  loadingText = "O'chirilmoqda...",
  icon = <OctagonAlert className="size-5" />,
  onConfirm,
  onCancel,
  isOpen,
  setIsOpen,
  disabled = false,
  dialogSize = 'md',
  itemName = '',
  contentClassName = '',
}) => {
  const [internalLoading, setInternalLoading] = useState<boolean>(false);

  const dialogProps =
    isOpen !== undefined && setIsOpen
      ? { open: isOpen, onOpenChange: setIsOpen }
      : {};

  const handleConfirm = async () => {
    if (!onConfirm) return;

    setInternalLoading(true);

    try {
      await Promise.resolve(onConfirm());
      if (setIsOpen) {
        setIsOpen(false);
      }
    } catch (err) {
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

  // Enhance description with item name if provided
  const enhancedDescription = itemName
    ? `${description} "${itemName}" will be permanently deleted.`
    : description;

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
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            {enhancedDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel} disabled={internalLoading}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={internalLoading}
            className="bg-destructive hover:bg-destructive/90"
          >
            {internalLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                {loadingText}
              </span>
            ) : (
              confirmText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmationDialog;
