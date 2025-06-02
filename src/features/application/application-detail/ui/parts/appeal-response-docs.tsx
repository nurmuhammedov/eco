import { ColumnDef } from '@tanstack/react-table';

import { DataTable } from '@/shared/components/common/data-table';
import { useResponseDocs } from '@/features/application/application-detail/hooks/use-response-docs.tsx';
import { Button } from '@/shared/components/ui/button.tsx';
import FileLink from '@/shared/components/common/file-link.tsx';
import { useConfirmDocument } from '@/features/application/application-detail/hooks/mutations/use-confirm-document.tsx';
import { useAuth } from '@/shared/hooks/use-auth.ts';
import { UserRoles } from '@/entities/user';
import RejectDocumentModal from '@/features/application/application-detail/ui/modals/reject-document-modal.tsx';

const AppealResponseDocs = () => {
  const { data } = useResponseDocs();
  const { mutate: confirmDocument, isPending } = useConfirmDocument();
  const { user } = useAuth();
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'date',
      maxSize: 100,
      header: 'Sana'
    },
    {
      accessorKey: 'documentType',
      maxSize: 100,
      header: 'Hujjat nomi'
    },
    {
      accessorKey: 'isSigned',
      maxSize: 100,
      header: 'Imzo holati'
    },
    {
      accessorKey: 'path',
      maxSize: 100,
      header: 'Fayl',
      cell: (cell) => <FileLink url={cell.row.original?.path} />
    },
    {
      accessorKey: 'actions',
      maxSize: 100,
      header: 'Hujjat nomi',
      cell: (cell) => {
        const isAgreed = !!cell.row.original?.agreementStatus;
        const isRegionalUser = user?.role === UserRoles.REGIONAL;
        const isManager = user?.role === UserRoles.MANAGER;

        if ((isRegionalUser && !isAgreed) || (cell.row.original?.agreementStatus === 'AGREED' && isManager)) {
          return <div className="flex gap-1">
            <Button disabled={isPending} onClick={() => {
              if (confirm('Are u sure?')) {
                confirmDocument(cell.row.original?.documentId);
              }
            }} variant="success">{isRegionalUser ? 'Kelishildi' : 'Tasdiqlandi'}</Button>
            <RejectDocumentModal documentId={cell.row.original?.documentId}
                                 label={isRegionalUser ? 'Kelishilmadi' : 'Tasdiqlanmadi'} />
          </div>;
        }
      }
    }

  ];

  return (
    <DataTable
      isPaginated
      data={data || []}
      columns={columns as unknown as any}
      className="h-[calc(100svh-270px)]"
    />
  );
};

export default AppealResponseDocs;