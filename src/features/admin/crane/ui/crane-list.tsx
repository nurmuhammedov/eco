import { Crane } from '@/entities/admin/crane';
import { useFilters } from '@/shared/hooks/use-filters';
import { Fragment, useMemo, useState } from 'react';
import { DataTable } from '@/shared/components/common/data-table';
import { CraneFormDialog, useDeleteCrane, useListCrane } from '@/features/admin/crane';

interface CraneListProps {
  onAdd: () => void;
  onEdit: (id: number) => void;
}

export const CraneList = ({ onAdd, onEdit }: CraneListProps) => {
  const { filters } = useFilters();
  const [formDialog, setFormDialog] = useState({
    open: false,
    crane: null as Crane | null,
  });

  const { data, isLoading } = useListCrane({
    filters,
  });

  const { mutate: deleteCrane, isPending: isDeleting } = useDeleteCrane();

  const handOpenDialog = () => {
    onAdd();
  };

  const openEditDialog = (id: number) => {
    onEdit(id);
  };

  const tableData = useMemo(() => {
    return data;
  }, [filters]);

  const craneTableColumns = useMemo(
    () => [
      {
        maxSize: 20,
        accessorKey: 'number',
        header: 'No',
        cell: (cell) => cell.row.index + 1,
      },
      {
        accessorKey: 'name',
        header: 'Nomi',
      },
    ],
    [tableData],
  );

  return (
    <Fragment>
      <CraneFormDialog
        open={formDialog.open}
        onClose={() => setFormDialog({ open: false, crane: null })}
        crane={formDialog.crane}
      />
      <DataTable
        isPaginated
        data={data || []}
        isLoading={isLoading}
        columns={craneTableColumns}
        className="h-[calc(100svh-270px)]"
      />
    </Fragment>
  );
};
