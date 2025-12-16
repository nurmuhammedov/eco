import React from 'react'
import { cn } from '@/shared/lib/utils'
import { Download, Eye, Trash2 } from 'lucide-react'
import { FileData } from '../models/file-data.interface'

interface FileControlsProps {
  fileData: FileData | null
  fileUrl: string
  isLoading: boolean
  showPreview?: boolean
  showDownload?: boolean
  onPreviewClick: () => void
  onRemoveClick: () => void
}

export const FileControls: React.FC<FileControlsProps> = ({
  fileData,
  fileUrl,
  isLoading,
  showPreview = false,
  showDownload = false,
  onPreviewClick,
  onRemoveClick,
}) => {
  return (
    <div className="flex items-center border-l border-gray-100">
      {showPreview && (
        <button
          type="button"
          onClick={onPreviewClick}
          disabled={isLoading}
          className={cn(
            'p-2 text-gray-500 transition-colors',
            isLoading ? 'cursor-not-allowed' : 'hover:text-blue-500'
          )}
          title="Faylni ko‘rish"
        >
          {isLoading ? (
            <div className="size-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          ) : (
            <Eye size={16} />
          )}
        </button>
      )}

      {showDownload && (
        <a
          href={fileData?.blobUrl || fileUrl}
          download={fileData?.originalName}
          className="p-2 text-gray-500 transition-colors hover:text-blue-500"
          title="Faylni yuklab olish"
          onClick={(e) => e.stopPropagation()}
        >
          <Download size={16} />
        </a>
      )}

      <button
        type="button"
        onClick={onRemoveClick}
        className="p-2 text-gray-500 transition-colors hover:text-red-500"
        title="Faylni o‘chirish"
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}
