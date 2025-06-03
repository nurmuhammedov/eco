import { useApplicantDocs } from '@/features/application/application-detail/hooks/use-applicant-docs.tsx';
import { ColumnDef } from '@tanstack/react-table';
import { ISearchParams } from '@/shared/types';
import { DataTable } from '@/shared/components/common/data-table';
import { formatDate } from 'date-fns';
import { Badge } from '@/shared/components/ui/badge.tsx';
import { signStatuses } from '@/features/application/application-detail/ui/parts/appeal-response-docs.tsx';
import FileLink from '@/shared/components/common/file-link.tsx';
import { Eye } from 'lucide-react';
import { useState } from 'react';
import SignersModal from '@/features/application/application-detail/ui/modals/signers-modal.tsx';

const ApplicantDocsTable = () => {
  const { data } = useApplicantDocs();
  const [signers, setSigners] = useState<any[]>([]);

  const columns: ColumnDef<ISearchParams>[] = [
    {
      accessorKey: 'createdAt',
      maxSize: 100,
      header: 'Sana',
      cell: (cell) => formatDate(cell.row.original.createdAt, 'dd.MM.yyyy'),
    },
    {
      accessorKey: 'documentType',
      maxSize: 100,
      header: 'Hujjat nomi',
    },
    {
      accessorKey: 'isSigned',
      maxSize: 100,
      header: 'Imzo holati',
      cell: (cell) => {
        const currentStatus = cell.row.original?.isSigned;
        const currentLabel = signStatuses.get(currentStatus);
        const signersList = cell.row.original?.signers as any[];
        if (currentLabel) {
          return (
            <div className="flex gap-2 items-center">
              <Badge variant={currentLabel.variant}>{currentLabel.label}</Badge>
              {!!signersList.length && (
                <button
                  className="cursor-pointer hover:text-yellow-200 text-[#A6B1BB]"
                  onClick={() => {
                    setSigners(signersList);
                  }}
                >
                  <Eye size="18" />
                </button>
              )}
            </div>
          );
        }
      },
    },
    {
      accessorKey: 'path',
      maxSize: 100,
      header: 'Fayl',
      cell: (cell) => <FileLink url={cell.row.original?.path} />,
    },
  ];

  return (
    <>
      <DataTable isPaginated data={data || []} columns={columns as unknown as any} className="h-[calc(100svh-270px)]" />
      <SignersModal setSigners={setSigners} signers={signers} />
    </>
  );
};

export default ApplicantDocsTable;
