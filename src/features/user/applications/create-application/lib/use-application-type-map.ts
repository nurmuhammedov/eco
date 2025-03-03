import { ComponentType } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ApplicationTypeEnum } from '@/entities/user/applications/create-application/model/application.types';

// **📌 Avtomatik import qilish (Vite Import Meta.glob)**
const modules = import.meta.glob('../ui/**/regions-dictionary-table.tsx');

export const useApplicationTypeMap = () => {
  return Object.entries(modules).reduce(
    (acc, [path, importer]) => {
      const folderName = path.split('/').slice(-2, -1)[0]; // 📂 Papka nomini olish
      const enumKey = Object.values(ApplicationTypeEnum).find((key) =>
        key.toLowerCase().includes(folderName.replace(/-/g, '_')),
      );

      if (enumKey) {
        acc[enumKey as ApplicationTypeEnum] = importer as () => Promise<{
          default: ComponentType<{ form: UseFormReturn<any> }>;
        }>;
      }

      return acc;
    },
    {} as Record<
      ApplicationTypeEnum,
      () => Promise<{ default: ComponentType<{ form: UseFormReturn<any> }> }>
    >,
  );
};
