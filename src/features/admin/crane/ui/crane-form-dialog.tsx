import React from 'react';
import { Crane } from '@/entities/admin/crane';
import { EntityFormFactory } from '@/features/abstract';
import { CraneForm, craneFormSchema, CraneFormValues } from './crane-form';
import { useAddCrane, useDetailCrane, useEditCrane } from '@/features/admin/crane';

interface CraneFormDialogProps {
  open: boolean;
  onClose: () => void;
  crane?: any;
}

export const CraneFormDialog: React.FC<CraneFormDialogProps> = ({ open, onClose, crane }) => {
  // Entity-dan FormValues'ga konvertatsiya
  const entityToFormValues = (entity: Crane): CraneFormValues => {
    return { name: entity.name };
  };

  // FormValues'dan Entity'ga konvertatsiya
  const formValuesToEntity = (values: CraneFormValues): Omit<Crane, 'id'> => {
    return { name: values.name };
  };

  return (
    <EntityFormFactory<Crane, CraneFormValues>
      open={open}
      entity={crane}
      onClose={onClose}
      useCreateEntity={useAddCrane}
      useUpdateEntity={useEditCrane}
      useEntityDetails={useDetailCrane}
      validationSchema={craneFormSchema}
      renderForm={({ defaultValues, onSubmit, isSubmitting, mode }) => (
        <CraneForm defaultValues={defaultValues} onSubmit={onSubmit} isSubmitting={isSubmitting} mode={mode} />
      )}
      formValuesToEntity={formValuesToEntity}
      entityToFormValues={entityToFormValues}
      titles={{
        add: "Yangi kran qo'shish",
        edit: "Kran ma'lumotlarini tahrirlash",
      }}
      messages={{
        addSuccess: "Yangi kran muvaffaqiyatli qo'shildi",
        editSuccess: "Kran ma'lumotlari muvaffaqiyatli yangilandi",
      }}
    />
  );
};
