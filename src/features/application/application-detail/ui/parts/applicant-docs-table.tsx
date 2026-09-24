import { useApplicantDocs } from '@/features/application/application-detail/hooks/use-applicant-docs'
import { ColumnDef } from '@tanstack/react-table'
import type { ApplicationDocument, DocumentSigner } from '../../model/document-types'
import { DataTable } from '@/shared/components/common/data-table'
import { formatDate } from 'date-fns'
import { Badge } from '@/shared/components/ui/badge'
import { documentTypes } from '@/features/application/application-detail/ui/parts/appeal-response-docs'
import { signStatuses } from '../../model/sign-statuses'
import FileLink from '@/shared/components/common/file-link'
import { Eye } from 'lucide-react'
import { useState } from 'react'
import SignersModal from '@/features/application/application-detail/ui/modals/signers-modal'

const ApplicantDocsTable = () => {
  const { data, isLoading } = useApplicantDocs()
  const [signers, setSigners] = useState<DocumentSigner[]>([])

  const columns: ColumnDef<ApplicationDocument>[] = [
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
      cell: (cell) => {
        const status = cell.row.original.isFullySigned
        const currentLabel = signStatuses.get(status)
        const signersList = cell.row.original.signers ?? []
        if (currentLabel) {
          return (
            <div className="flex items-center gap-2">
              <Badge variant={currentLabel.variant}>{currentLabel.label}</Badge>
              {!!signersList.length && (
                <button
                  type="button"
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
  ]

  return (
    <>
      <DataTable showNumeration={false} isPaginated isLoading={isLoading} data={data || []} columns={columns} />
      <SignersModal setSigners={setSigners} signers={signers} />
    </>
  )
}

export default ApplicantDocsTable
