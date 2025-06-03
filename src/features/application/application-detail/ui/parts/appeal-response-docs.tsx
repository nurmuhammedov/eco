import { ColumnDef } from '@tanstack/react-table';

import { DataTable } from '@/shared/components/common/data-table';
import { useResponseDocs } from '@/features/application/application-detail/hooks/use-response-docs.tsx';
import { Button } from '@/shared/components/ui/button.tsx';
import FileLink from '@/shared/components/common/file-link.tsx';
import { useConfirmDocument } from '@/features/application/application-detail/hooks/mutations/use-confirm-document.tsx';
import { useAuth } from '@/shared/hooks/use-auth.ts';
import { UserRoles } from '@/entities/user';
import RejectDocumentModal from '@/features/application/application-detail/ui/modals/reject-document-modal.tsx';
import { Badge } from '@/shared/components/ui/badge.tsx';
import { formatDate } from 'date-fns';
import RejectMessageModal from '@/features/application/application-detail/ui/modals/reject-message-modal.tsx';
import { useState } from 'react';
import { Eye, Info } from 'lucide-react';
import SignersModal from '@/features/application/application-detail/ui/modals/signers-modal.tsx';

export const signStatuses = new Map([
  [true, { label: 'Imzolangan', variant: 'info' }],
  [false, { label: 'Imzolanmagan', variant: 'warning' }],
] as const);

//TODO:vinesti v enum ili const, sam map vinesti v otdelni fayl
export const approveStatuses = new Map([
  ['AGREED', { label: 'Kelishildi', variant: 'success' }],
  ['NOT_AGREED', { label: 'Kelishilmadi', variant: 'error' }],
  ['APPROVED', { label: 'Tasdiqlandi', variant: 'success' }],
  ['NOT_APPROVED', { label: 'Tasdiqlanmadi', variant: 'error' }],
] as const);

//TODO:vinesti  v enum ili const,  sam map vinesti v otdelni fayl
export const documentTypes = new Map([
  ['REPORT', "Ma'lumotnoma"],
  ['ACT', 'Dalolatnoma'],
  ['DECREE', 'Qaror'],
  ['APPEAL', 'Ariza'],
  ['REPLY_LETTER', 'Javob xati'],
]);

const AppealResponseDocs = () => {
  const [rejectMessage, setRejectMessage] = useState<string>('');
  const [signers, setSigners] = useState<any[]>([]);
  const { data } = useResponseDocs();
  const { mutate: confirmDocument, isPending } = useConfirmDocument();
  const { user } = useAuth();
  const columns: ColumnDef<any>[] = [
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
      cell: (cell) => documentTypes.get(cell.row.original.documentType),
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
    {
      accessorKey: 'actions',
      maxSize: 100,
      header: 'Tasdiqlash',
      cell: (cell) => {
        const isAgreed = !!cell.row.original?.agreementStatus;
        const isRegionalUser = user?.role === UserRoles.REGIONAL;
        const isManager = user?.role === UserRoles.MANAGER;
        const currentAgreement = cell.row.original?.agreementStatus;
        const currentBadge = approveStatuses.get(currentAgreement);
        const message = cell.row.original?.description;
        if ((isRegionalUser && !isAgreed) || (currentAgreement === 'AGREED' && isManager)) {
          return (
            <div className="flex gap-1">
              <Button
                disabled={isPending}
                onClick={() => {
                  if (confirm('Are u sure?')) {
                    confirmDocument(cell.row.original?.documentId);
                  }
                }}
                variant="success"
              >
                {isRegionalUser ? 'Kelishildi' : 'Tasdiqlandi'}
              </Button>
              <RejectDocumentModal
                documentId={cell.row.original?.documentId}
                label={isRegionalUser ? 'Kelishilmadi' : 'Tasdiqlanmadi'}
              />
            </div>
          );
        }
        if (currentBadge) {
          return (
            <div className="flex gap-2 items-center">
              <Badge variant={currentBadge.variant}>{currentBadge.label}</Badge>
              {message && (
                <button
                  className="cursor-pointer hover:text-yellow-200"
                  onClick={() => {
                    setRejectMessage(message);
                  }}
                >
                  <Info />
                </button>
              )}
            </div>
          );
        }
      },
    },
  ];

  return (
    <>
      <DataTable isPaginated data={data || []} columns={columns as unknown as any} className="h-[calc(100svh-270px)]" />
      <RejectMessageModal setMessage={setRejectMessage} message={rejectMessage} />
      <SignersModal setSigners={setSigners} signers={signers} />
    </>
  );
};

export default AppealResponseDocs;
