import React from 'react';
import { cn } from '@/shared/lib/utils';
import { Download, Eye, Trash2 } from 'lucide-react';
import { FileData } from '../models/file-data.interface';

interface FileControlsProps {
  fileData: FileData | null;
  fileUrl: string;
  isLoading: boolean;
  showPreview?: boolean;
  showDownload?: boolean;
  onPreviewClick: () => void;
  onRemoveClick: () => void;
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
    <div className="flex-shrink-0 flex items-center border-l border-gray-100">
      {/* Ko'rish tugmasi */}
      {showPreview && (
        <button
          type="button"
          onClick={onPreviewClick}
          disabled={isLoading}
          className={cn(
            'p-2 text-gray-500 transition-colors duration-150',
            isLoading ? 'cursor-not-allowed' : 'hover:text-blue-400',
          )}
          title="Faylni ko'rish"
        >
          {isLoading ? (
            <div className="size-4 rounded-full border-2 border-blue-400 border-t-gray-500 animate-spin" />
          ) : (
            <Eye size={16} />
          )}
        </button>
      )}

      {/* Yuklab olish tugmasi */}
      {showDownload && (
        <a
          href={fileData?.blobUrl || fileUrl}
          download={fileData?.originalName}
          className="p-2 text-gray-500 hover:text-blue-400 transition-colors duration-150"
          title="Faylni yuklab olish"
          onClick={(e) => e.stopPropagation()}
        >
          <Download size={16} />
        </a>
      )}

      {/* O'chirish tugmasi */}
      <button
        type="button"
        onClick={onRemoveClick}
        className="p-2 text-gray-500 hover:text-red-500 transition-colors duration-150"
        title="Faylni o'chirish"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};
