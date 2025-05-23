import React from 'react';
import { FileAudio, FilePlus, FileText, FileVideo, ImageIcon, Sheet } from 'lucide-react';

interface FileIconProps {
  fileType?: string;
  className?: string;
}

export const FileIcon: React.FC<FileIconProps> = ({ fileType, className }) => {
  if (!fileType) return <FilePlus size={16} className={className} />;

  if (fileType.includes('image/')) return <ImageIcon size={16} className={className} />;
  if (fileType.includes('application/vnd.ms-excel') || fileType.includes('spreadsheetml'))
    return <Sheet size={16} className={className} />;
  if (fileType.includes('audio/')) return <FileAudio size={16} className={className} />;
  if (fileType.includes('video/')) return <FileVideo size={16} className={className} />;

  return <FileText size={16} className={className} />;
};
