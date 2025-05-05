// src/widgets/equipment/ui/EntityPage.tsx
import React, { useCallback, useState } from 'react';
import { EntityPageProps } from '../model/types';
import { EntityMode } from '../model/constants';
import { BaseEntity } from '@/entities/base';
import { useFilters } from '@/shared/hooks/use-filters';

/**
 * Yangilangan EntityPage komponenti - faqat ADD/EDIT dialog mode bilan
 *
 * Generic parametrlar:
 * T - Base entity type
 * LC - List component props extension
 */
export function EntityPage<T extends BaseEntity, LC extends object = object>({
  components,
  equipmentId,
  title,
  addButtonLabel,
  className,
  ...restProps
}: Omit<EntityPageProps<T>, 'ViewComponent'> & {
  components: {
    ListComponent: React.FC<
      {
        onAdd: () => void;
        onEdit: (id: string) => void;
      } & LC
    >;
    FormDialogComponent: React.FC<{
      open: boolean;
      onClose: () => void;
      entity?: T | null;
    }>;
  };
}) {
  // Query params
  const { filters, setFilters } = useFilters();
  const entityId = filters.id;
  const mode = (filters.mode as EntityMode) || EntityMode.LIST;

  // Dialog states - query params'dan boshqariladi
  const [formDialogState, setFormDialogState] = useState({
    open: mode === EntityMode.ADD || mode === EntityMode.EDIT,
    entity: null as T | null,
  });

  // useEffect bilan dialog holatini sync qilib turish
  React.useEffect(() => {
    // Query params o'zgarganda dialog holatini yangilash
    setFormDialogState({
      open: mode === EntityMode.ADD || mode === EntityMode.EDIT,
      entity: null,
    });
  }, [mode, entityId]);

  /**
   * LIST mode ga qaytish
   */
  const handleBackToList = useCallback(() => {
    setFilters({ mode: null, id: null });

    // Dialog holatini yopish
    setFormDialogState({
      open: false,
      entity: null,
    });
  }, [setFilters]);

  /**
   * ADD mode ga o'tish
   */
  const handleAdd = useCallback(() => {
    setFilters({ mode: EntityMode.ADD, id: null });

    // Dialog holatini yangilash
    setFormDialogState({
      open: true,
      entity: null,
    });
  }, [setFilters]);

  /**
   * EDIT mode ga o'tish
   */
  const handleEdit = useCallback(
    (id: string) => {
      setFilters({ mode: EntityMode.EDIT, id });

      // Kerakli entity ma'lumotlarini olish
      // Bu yerda kerak bo'lsa API dan entity ma'lumotlarini olish mumkin

      // Dialog holatini yangilash
      setFormDialogState({
        open: true,
        entity: { id } as unknown as T, // Entity ma'lumotlari to'liq bo'lmasligi mumkin, id yetarli
      });
    },
    [setFilters],
  );

  /**
   * Dialog yopilganda
   */
  const handleCloseFormDialog = useCallback(() => {
    // Query parametrlarni o'chirish
    handleBackToList();
  }, [handleBackToList]);

  // ListComponent'ni render qilish
  const { ListComponent, FormDialogComponent } = components;

  return (
    <div className={className}>
      {/* List component */}
      <ListComponent onAdd={handleAdd} onEdit={handleEdit} {...(restProps as LC)} />

      {/* Form Dialog (Add/Edit) */}
      <FormDialogComponent
        open={formDialogState.open}
        onClose={handleCloseFormDialog}
        entity={formDialogState.entity}
      />
    </div>
  );
}
