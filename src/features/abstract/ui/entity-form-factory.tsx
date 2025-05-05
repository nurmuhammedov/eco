import { z } from 'zod';
import React from 'react';
import { BaseEntity } from '@/entities/base';
import { toast } from 'sonner';
import { EntityFormDialog } from '@/features/abstract';

interface EntityFormFactoryProps<TEntity extends BaseEntity, TFormValues> {
  /**
   * Komponenta ko'rinish holati
   */
  open: boolean;

  /**
   * Komponenta yopilgandagi callback
   */
  onClose: () => void;

  /**
   * Tahrirlash uchun entity
   */
  entity?: TEntity | null;

  /**
   * Entity yaratish hook'i
   */
  useCreateEntity: () => {
    mutate: (data: Omit<TEntity, 'id'>) => Promise<TEntity>;
    isPending: boolean;
  };

  /**
   * Entity yangilash hook'i
   */
  useUpdateEntity: () => {
    mutate: (data: { id: number } & Partial<Omit<TEntity, 'id'>>) => Promise<TEntity>;
    isPending: boolean;
  };

  /**
   * Entity bitta elementi uchun hook (edit mode'da)
   */
  useEntityDetails?: (id: number) => {
    data: TEntity | undefined;
    isLoading: boolean;
    error: Error | null;
  };

  /**
   * Form validatsiya sxemasi
   */
  validationSchema: z.ZodType<TFormValues>;

  /**
   * Form komponentini render qilish funksiyasi
   */
  renderForm: (props: {
    defaultValues?: TFormValues;
    onSubmit: (values: TFormValues) => void;
    isSubmitting: boolean;
    mode: 'add' | 'edit';
  }) => React.ReactNode;

  /**
   * Form ma'lumotlarini entity'ga o'girish
   */
  formValuesToEntity: (values: TFormValues) => Omit<TEntity, 'id'>;

  /**
   * Entity ma'lumotlarini formaga o'girish (edit mode uchun)
   */
  entityToFormValues: (entity: TEntity) => TFormValues;

  /**
   * Sarlavhalar
   */
  titles: {
    add: string;
    edit: string;
  };

  /**
   * Xabarlar
   */
  messages?: {
    addSuccess?: string;
    editSuccess?: string;
    addError?: string;
    editError?: string;
  };
}

/**
 * Entity qo'shish va tahrirlash uchun universal forma factory
 *
 * @template TEntity - Entity tipi
 * @template TFormValues - Forma ma'lumotlari tipi
 */
export function EntityFormFactory<TEntity extends BaseEntity, TFormValues extends Record<string, any>>({
  open,
  onClose,
  entity,
  useCreateEntity,
  useUpdateEntity,
  useEntityDetails,
  renderForm,
  formValuesToEntity,
  entityToFormValues,
  titles,
}: EntityFormFactoryProps<TEntity, TFormValues>) {
  // Entity ID orqali edit mode'mi aniqlaymiz
  const isEditMode = Boolean(entity?.id);

  // Create va Update uchun hooklar
  const { mutate: createEntity, isPending: isCreating } = useCreateEntity();
  const { mutate: updateEntity, isPending: isUpdating } = useUpdateEntity();

  // Edit mode uchun entity detallari
  const entityDetails =
    isEditMode && useEntityDetails
      ? useEntityDetails(entity?.id as number)
      : { data: entity, isLoading: false, error: null };

  // Form yuborilganda
  const handleSubmit = async (values: TFormValues) => {
    try {
      if (isEditMode && entity) {
        // Update existing entity
        await updateEntity({
          id: entity.id,
          ...formValuesToEntity(values),
        });

        toast("Ma'lumotlar muvaffaqiyatli yangilandi");
      } else {
        // Create new entity
        await createEntity(formValuesToEntity(values));

        toast("Ma'lumotlar muvaffaqiyatli qo'shildi");
      }

      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Noma'lum xatolik";

      toast(errorMessage);
    }
  };

  // Default values for form
  const getDefaultValues = (): TFormValues | undefined => {
    if (isEditMode && entityDetails.data) {
      return entityToFormValues(entityDetails.data);
    }
    return undefined;
  };

  return (
    <EntityFormDialog<TFormValues>
      open={open}
      onClose={onClose}
      title={isEditMode ? titles.edit : titles.add}
      mode={isEditMode ? 'edit' : 'add'}
      renderForm={renderForm}
      onSubmit={handleSubmit}
      defaultValues={getDefaultValues()}
      isLoading={entityDetails.isLoading}
      isSubmitting={isCreating || isUpdating}
    />
  );
}
