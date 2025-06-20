// src/features/admin/checklist-templates/ui/checklist-templates-list.tsx
import {
  ChecklistTemplate,
  useChecklistTemplateList,
  useDeleteChecklistTemplate,
} from '@/entities/admin/checklist-templates';
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table';
import FileLink from '@/shared/components/common/file-link.tsx';
import useCustomSearchParams from '@/shared/hooks/api/useSearchParams';
import { useChecklistTemplateDrawer } from '@/shared/hooks/entity-hooks';
import { UIModeEnum } from '@/shared/types';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

export function ChecklistTemplatesList() {
  const { t } = useTranslation('common');
  const { onOpen } = useChecklistTemplateDrawer();
  const { paramsObject } = useCustomSearchParams();
  const { mutate: deleteTemplate } = useDeleteChecklistTemplate();

  const { data, isLoading } = useChecklistTemplateList({
    page: paramsObject.page ? parseInt(paramsObject.page, 10) : 1,
    size: paramsObject.size ? parseInt(paramsObject.size, 10) : 20,
    active: paramsObject.active?.toString() || 'true',
  });

  const columns: ColumnDef<ChecklistTemplate>[] = [
    {
      accessorKey: 'name',
      header: t('checklist_name', 'Cheklist nomi'),
    },
    {
      accessorKey: 'path',
      header: t('checklist_file', 'Cheklist fayli'),
      cell: ({ row }) => <FileLink url={row.original.path} />,
    },
    {
      id: 'actions',
      header: t('actions.title', 'Amallar'),
      cell: ({ row }: any) => (
        <DataTableRowActions
          row={row}
          showEdit
          onEdit={() => onOpen(UIModeEnum.EDIT, { id: row.original.id })}
          onDelete={() => deleteTemplate(row.original.id)}
        />
      ),
      size: 100,
    },
  ];

  return (
    <DataTable
      isPaginated
      data={data?.data || []}
      columns={columns}
      isLoading={isLoading}
      className="h-[calc(100svh-320px)]"
    />
  );
}
