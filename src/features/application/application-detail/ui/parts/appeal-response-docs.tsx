import { UserRoles } from '@/entities/user'
import { useConfirmDocument } from '@/features/application/application-detail/hooks/mutations/use-confirm-document.tsx'
import { useResponseDocs } from '@/features/application/application-detail/hooks/use-response-docs.tsx'
import RejectDocumentModal from '@/features/application/application-detail/ui/modals/reject-document-modal.tsx'
import RejectMessageModal from '@/features/application/application-detail/ui/modals/reject-message-modal.tsx'
import SignersModal from '@/features/application/application-detail/ui/modals/signers-modal.tsx'
import { DataTable } from '@/shared/components/common/data-table'
import FileLink from '@/shared/components/common/file-link.tsx'
import { Badge } from '@/shared/components/ui/badge.tsx'
import { Button } from '@/shared/components/ui/button.tsx'
import { useAuth } from '@/shared/hooks/use-auth.ts'
import { ColumnDef } from '@tanstack/react-table'
import { formatDate } from 'date-fns'
import { Eye, Info } from 'lucide-react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import ConfirmWithRegistryModal from '../modals/confirm-with-registry-modal.tsx'
import { ApplicationTypeEnum } from '@/entities/create-application'

export const signStatuses = new Map([
  [true, { label: 'Imzolangan', variant: 'info' }],
  [false, { label: 'Imzolanmagan', variant: 'warning' }],
] as const)

export const approveStatuses = new Map([
  ['AGREED', { label: 'Kelishildi', variant: 'success' }],
  ['NOT_AGREED', { label: 'Kelishilmadi', variant: 'error' }],
  ['APPROVED', { label: 'Tasdiqlandi', variant: 'success' }],
  ['NOT_APPROVED', { label: 'Tasdiqlanmadi', variant: 'error' }],
] as const)

export const documentTypes = new Map([
  ['REPORT', 'Maʼlumotnoma'],
  ['ACT', 'Dalolatnoma'],
  ['DECREE', 'Qaror'],
  ['APPEAL', 'Ariza'],
  ['REPLY_LETTER', 'Javob xati'],
])

const managerTypes = [
  ApplicationTypeEnum.REGISTER_CRANE,
  ApplicationTypeEnum.DEREGISTER_CRANE,
  ApplicationTypeEnum.RE_REGISTER_CRANE,
  ApplicationTypeEnum.REGISTER_ELEVATOR,
  ApplicationTypeEnum.DEREGISTER_ELEVATOR,
  ApplicationTypeEnum.RE_REGISTER_ELEVATOR,
]

interface Props {
  appeal_type: (typeof ApplicationTypeEnum)[keyof typeof ApplicationTypeEnum]
}

const AppealResponseDocs: React.FC<Props> = ({ appeal_type }) => {
  const [rejectMessage, setRejectMessage] = useState<string>('')
  const [signers, setSigners] = useState<any[]>([])
  const { data } = useResponseDocs()
  const { mutate: confirmDocument, isPending } = useConfirmDocument()
  const { user } = useAuth()
  const { id: appealId } = useParams()

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
      accessorKey: 'isFullySigned',
      maxSize: 100,
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
      maxSize: 100,
      header: 'Fayl',
      cell: (cell) => <FileLink url={cell.row.original?.path} />,
    },
    {
      maxSize: 100,
      header: 'Tasdiqlash',
      cell: (cell) => {
        const isAgreed = !!cell.row.original?.agreementStatus
        const isRegionalUser = user?.role === UserRoles.REGIONAL
        const isManager = user?.role === UserRoles.MANAGER
        const isHead = user?.role === UserRoles.HEAD
        const currentAgreement = cell.row.original?.agreementStatus
        const currentBadge = approveStatuses.get(currentAgreement)
        const message = cell.row.original?.description
        const documentId = cell.row.original?.documentId
        const isAppealForManager = managerTypes.includes(appeal_type)
        if ((isHead && !isAgreed) || (isRegionalUser && !isAgreed) || (currentAgreement === 'AGREED' && isManager)) {
          if (isManager && isAppealForManager) {
            return (
              <div className="flex gap-4">
                <ConfirmWithRegistryModal documentId={documentId} />
                <RejectDocumentModal documentId={documentId} label={'Tasdiqlanmadi'} />
              </div>
            )
          } else if (isRegionalUser || isHead) {
            if (isAppealForManager) {
              return (
                <div className="flex gap-1">
                  <Button
                    disabled={isPending}
                    onClick={() => {
                      confirmDocument({ appealId, documentId })
                    }}
                    variant="success"
                  >
                    Kelishildi
                  </Button>
                  <RejectDocumentModal documentId={documentId} label={'Kelishilmadi'} />
                </div>
              )
            } else {
              return (
                <div className="flex gap-4">
                  <ConfirmWithRegistryModal documentId={documentId} />
                  <RejectDocumentModal documentId={documentId} label={'Tasdiqlanmadi'} />
                </div>
              )
            }
          }
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
