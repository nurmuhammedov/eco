import { ApplicationTypeEnum } from '@/entities/create-application'
import { useResponseDocs } from '@/features/application/application-detail/hooks/use-response-docs.tsx'
import { RejectAppealModal } from '@/features/application/application-detail/ui/modals/reject-appeal-modal.tsx'
import RejectDocumentModal from '@/features/application/application-detail/ui/modals/reject-document-modal.tsx'
import RejectMessageModal from '@/features/application/application-detail/ui/modals/reject-message-modal.tsx'
import SignersModal from '@/features/application/application-detail/ui/modals/signers-modal.tsx'
import { DataTable } from '@/shared/components/common/data-table'
import FileLink from '@/shared/components/common/file-link.tsx'
import { Badge } from '@/shared/components/ui/badge.tsx'
import { useAuth } from '@/shared/hooks/use-auth.ts'
import { ColumnDef } from '@tanstack/react-table'
import { formatDate } from 'date-fns'
import { Eye, Info } from 'lucide-react'
import React, { useState } from 'react'
import ConfirmWithRegistryModal from '../modals/confirm-with-registry-modal.tsx'
import { getAppealPermissions } from '@/features/application/application-detail/model/appeal-permissions'

export const signStatuses = new Map([
  [true, { label: 'Imzolangan', variant: 'info' }],
  [false, { label: 'Imzolanmagan', variant: 'warning' }],
] as const)

export const approveStatuses = new Map([
  ['AGREED', { label: 'Kelishildi', variant: 'success' }],
  ['NOT_AGREED', { label: 'Ijro noto‘g‘ri bajarilgan', variant: 'error' }],
  ['APPROVED', { label: 'Tasdiqlandi', variant: 'success' }],
  ['NOT_APPROVED', { label: 'Ijro noto‘g‘ri bajarilgan', variant: 'error' }],
] as const)

export const documentTypes = new Map([
  ['REPORT', 'Maʼlumotnoma'],
  ['ACT', 'Dalolatnoma'],
  ['DECREE', 'Qaror'],
  ['APPEAL', 'Ariza'],
  ['REPLY_LETTER', 'Javob xati'],
])

interface Props {
  appeal_type: (typeof ApplicationTypeEnum)[keyof typeof ApplicationTypeEnum]
}

const AppealResponseDocs: React.FC<Props> = ({ appeal_type }) => {
  const [rejectMessage, setRejectMessage] = useState<string>('')
  const [signers, setSigners] = useState<any[]>([])
  const { data } = useResponseDocs()
  const { user } = useAuth()

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'createdAt',
      header: 'Sana',
      cell: (cell) => formatDate(cell.row.original.createdAt, 'dd.MM.yyyy'),
    },
    {
      accessorKey: 'documentType',
      header: 'Hujjat nomi',
      cell: (cell) => documentTypes.get(cell.row.original.documentType),
    },
    {
      accessorKey: 'isFullySigned',
      header: 'Imzo holati',
      cell: (cell: any) => {
        const currentStatus = cell.row.original?.isFullySigned
        const currentLabel = signStatuses.get(currentStatus)
        const signersList = cell.row.original?.signers as any[]
        if (currentLabel) {
          return (
            <div className="flex items-center gap-2">
              <Badge variant={currentLabel.variant}>{currentLabel.label}</Badge>
              {!!signersList.length && (
                <button
                  className="cursor-pointer text-[#A6B1BB] hover:text-yellow-200"
                  onClick={() => {
                    setSigners(signersList)
                  }}
                >
                  <Eye size="18" />
                </button>
              )}
            </div>
          )
        }
      },
    },
    {
      accessorKey: 'path',
      header: 'Fayl',
      cell: (cell) => <FileLink url={cell.row.original?.path} />,
    },
    {
      header: 'Tasdiqlash',
      cell: (cell) => {
        const isAgreed = !!cell.row.original?.agreementStatus
        const currentAgreement = cell.row.original?.agreementStatus
        const currentBadge = approveStatuses.get(currentAgreement)
        const message = cell.row.original?.description
        const documentId = cell.row.original?.documentId

        const { canAgree } = getAppealPermissions(user?.role, appeal_type, undefined)

        if (canAgree && !isAgreed) {
          return (
            <div className="flex flex-wrap items-center gap-2">
              <RejectDocumentModal documentId={documentId} label={'Ijro noto‘g‘ri bajarilgan'} />
              <RejectAppealModal documentId={documentId} />
              <ConfirmWithRegistryModal documentId={documentId} />
            </div>
          )
        }
        if (currentBadge) {
          return (
            <div className="flex items-center gap-2">
              <Badge variant={currentBadge.variant}>{currentBadge.label}</Badge>
              {message && (
                <button
                  className="cursor-pointer hover:text-yellow-200"
                  onClick={() => {
                    setRejectMessage(message)
                  }}
                >
                  <Info />
                </button>
              )}
            </div>
          )
        }
      },
    },
  ]

  return (
    <>
      <DataTable showNumeration={false} isPaginated data={data || []} columns={columns as unknown as any} />
      <RejectMessageModal setMessage={setRejectMessage} message={rejectMessage} />
      <SignersModal setSigners={setSigners} signers={signers} />
    </>
  )
}

export default AppealResponseDocs
