import { ApplicationStatus } from '@/entities/application'
import { UserRoles } from '@/entities/user'
import FileLink from '@/shared/components/common/file-link.tsx'
import { FC } from 'react'
import { getDate } from '@/shared/utils/date'

type FileType = {
  label: string
  data: {
    path: string
    number: string
    uploadDate: string
    expiryDate: string
  }
  fieldName: string
}

interface Props {
  files: FileType[]
  userRole?: UserRoles
  applicationStatus?: ApplicationStatus
  appealId?: string
  register?: boolean
  url?: string
  edit?: boolean
}

const FilesSection: FC<Props> = ({ files }) => {
  // const canEdit = userRole === UserRoles.INSPECTOR && applicationStatus === ApplicationStatus.IN_PROCESS && edit
  // const canInspectorEdit = userRole === UserRoles.INSPECTOR && register && !appealId

  const showFileData = (file: FileType) => {
    if (!file.data.path && !file.data.number && !file.data.uploadDate && !file.data.expiryDate) {
      return <span className="text-red-600">Mavjud emas</span>
    } else {
      return (
        <div className={'flex-col'}>
          {file.data?.path && <FileLink url={file.data.path} className={'mb-1'} />}
          {file.data?.expiryDate && (
            <div className={'mr-1 mb-1 text-xs text-nowrap text-gray-400'}>
              Amal qilish muddati: {getDate(file.data.expiryDate)}
            </div>
          )}
          {file.data?.number && (
            <div className={'mb-1 text-xs text-nowrap text-gray-400'}>Raqam: {file.data.number}</div>
          )}
          {file.data?.uploadDate && (
            <div className={'text-xs text-nowrap text-gray-400'}>Yuklash sanasi: {getDate(file.data.uploadDate)}</div>
          )}
        </div>
      )
    }
  }

  return (
    <div className="grid grid-cols-2 gap-x-8">
      {files.map((file) => (
        <div key={file.label} className="flex items-center justify-between border-b border-b-[#E5E7EB] px-3 py-4">
          <p className={'pr-5'}>{file.label}</p>
          <div className="flex items-center gap-2">
            {showFileData(file)}
            {/*{canInspectorEdit ? <FileEditModal url={url} fieldName={file.fieldName} /> : showFileData(file)}*/}
            {/*{canEdit && <UpdateFileModal appealId={appealId} fieldName={file.fieldName} />}*/}
          </div>
        </div>
      ))}
    </div>
  )
}

export default FilesSection
