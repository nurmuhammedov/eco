import { useDeletePreventionFile, usePreventionFile, useUploadPreventionFile } from '@/entities/prevention'
import { UserRoles } from '@/entities/user'
import DeleteConfirmationDialog from '@/shared/components/common/delete-confirm-dialog'
import FileLink from '@/shared/components/common/file-link'
import { InputFile } from '@/shared/components/common/file-upload'
import { Button } from '@/shared/components/ui/button'
import { useAuth } from '@/shared/hooks/use-auth'
import { Loader2, Trash2 } from 'lucide-react'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types.ts'

interface PreventionFileHandlerProps {
  year: number
}

export const PreventionFileHandler: FC<PreventionFileHandlerProps> = ({ year }) => {
  const { user } = useAuth()
  const form = useForm()

  const { data: fileData, isLoading, isError } = usePreventionFile(year)
  const { mutate: uploadFile } = useUploadPreventionFile(form)
  const { mutate: deleteFile, isPending: isDeleting } = useDeletePreventionFile()

  const isRegional = user?.role === UserRoles.REGIONAL
  const isVisible = user?.role !== UserRoles.LEGAL && user?.role !== UserRoles.INDIVIDUAL

  if (!isVisible) {
    return null
  }

  if (isLoading) {
    return (
      <Button variant="outline" disabled size="icon">
        <Loader2 className="animate-spin" />
      </Button>
    )
  }

  const handleFileUpload = (path: string) => {
    uploadFile(path)
  }

  const handleDelete = () => {
    deleteFile(fileData?.data?.path)
  }

  if (fileData?.data?.path && !isError) {
    if (isRegional) {
      return (
        <div className="flex items-center gap-2">
          <FileLink url={fileData.data.path} title="Rejani yuklab olish" />
          <DeleteConfirmationDialog onConfirm={handleDelete}>
            <Button variant="destructive" size="icon" loading={isDeleting}>
              <Trash2 size={16} />
            </Button>
          </DeleteConfirmationDialog>
        </div>
      )
    }
    return <FileLink url={fileData.data.path} title="Rejani yuklab olish" />
  }

  if (isRegional) {
    return (
      <InputFile
        form={form}
        accept={[FileTypes.PDF]}
        name="prevention_file"
        onUploadComplete={handleFileUpload}
        buttonText="Reja faylini yuklash"
      />
    )
  }

  return null
}
