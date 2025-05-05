import { BaseEntity } from '@/entities/base';
import React, { ReactNode } from 'react';

export interface EntityListComponentProps<T extends BaseEntity> {
  onAdd: () => void;
  onEdit: (id: string) => void;
  onDelete?: (id: string) => void;
  additionalActions?: (entity: T) => ReactNode;
}

/**
 * Dialog-based EntityPage uchun komponentlar
 *
 * Type parametrlari:
 * T - Entity tipi
 * LC - List component props customization (optional)
 */
export interface EntityPageComponents<T extends BaseEntity, LC extends object = object> {
  /** Ma'lumotlar ro'yxatini ko'rsatuvchi komponent */
  ListComponent: React.FC<EntityListComponentProps<T> & LC>;

  /** Form Dialog komponenti (Add va Edit uchun) */
  FormDialogComponent: React.FC<{
    open: boolean;
    onClose: () => void;
    entity?: T | null;
  }>;
}

/**
 * EntityPage konfiguratsiyasi
 */
export interface EntityPageConfig<T extends BaseEntity, LC extends object = object> {
  /** Komponentlar to'plami */
  components: EntityPageComponents<T, LC>;

  /** Jihoz turi identifikatori */
  equipmentId: string;

  /** Sarlavha */
  title: string;

  /** Qo'shish tugmasi matni */
  addButtonLabel: string;

  /** Custom CSS klasslar */
  className?: string;

  /** Qo'shimcha parametrlar */
  [key: string]: any;
}

/**
 * EntityPage props
 */
export type EntityPageProps<T extends BaseEntity, LC extends object = object> = EntityPageConfig<T, LC>;
