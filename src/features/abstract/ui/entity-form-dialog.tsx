import React from 'react';
import { Loader } from '@/shared/components/common';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';

type FormDialogMode = 'add' | 'edit';

interface FormDialogProps<TFormValues> {
  /**
   * Dialog visible holati
   */
  open: boolean;

  /**
   * Dialog yopilishi
   */
  onClose: () => void;

  /**
   * Dialog sarlavhasi
   */
  title: string;

  /**
   * Qo'shimcha tavsif (optional)
   */
  description?: string;

  /**
   * Dialog mode (add, edit)
   */
  mode: FormDialogMode;

  /**
   * Form component render qilish funksiyasi
   */
  renderForm: (props: {
    onSubmit: (values: TFormValues) => void;
    isSubmitting: boolean;
    defaultValues?: TFormValues;
    mode: FormDialogMode;
  }) => React.ReactNode;

  /**
   * Form yuborilgandagi ma'lumotlar
   */
  onSubmit: (values: TFormValues) => Promise<void> | void;

  /**
   * Edit mode uchun ma'lumotlar
   */
  defaultValues?: TFormValues;

  /**
   * Loading holati
   */
  isLoading?: boolean;

  /**
   * Submit loading holatini ko'rsatadimi
   */
  isSubmitting?: boolean;

  /**
   * Shablonni kengaytirish uchun qo'shimcha props
   */
  [key: string]: any;
}

/**
 * Universal Form Dialog komponenti
 *
 * Bu komponent har qanday forma uchun reusable dialog yaratish
 * imkonini beradi.
 *
 * @template TFormValues - Forma ma'lumotlari tipi
 */
export function EntityFormDialog<TFormValues>({
  open,
  onClose,
  title,
  description,
  mode,
  renderForm,
  onSubmit,
  defaultValues,
  isLoading = false,
  isSubmitting = false,
}: FormDialogProps<TFormValues>) {
  // Form submit handler
  const handleSubmit = async (values: TFormValues) => {
    try {
      await onSubmit(values);
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
      // Toast notification ko'rsatish mumkin
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader isVisible />
          </div>
        ) : (
          <div className="py-4">
            {renderForm({
              onSubmit: handleSubmit,
              isSubmitting,
              defaultValues,
              mode,
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
