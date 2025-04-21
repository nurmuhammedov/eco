// Truncate file name
import { FileData } from '../models/file-data.interface';

export const truncateFilename = (filename: string, maxLength: number): string => {
  if (filename.length <= maxLength) return filename;

  const extension = filename.includes('.') ? filename.split('.').pop() : '';
  const name = filename.includes('.') ? filename.substring(0, filename.lastIndexOf('.')) : filename;

  // Uzunlikning 70% boshidan, 30% oxiridan olish
  const startLength = Math.floor(maxLength * 0.7);
  const endLength = maxLength - startLength - 3; // 3 - ellipsis (...) uchun

  return `${name.substring(0, startLength)}...${name.substring(name.length - endLength)}${extension ? `.${extension}` : ''}`;
};

/**
 * Brauzerda ko'rish mumkin bo'lgan fayl turlarini tekshirish
 */
export const canPreviewInBrowser = (fileType?: string): boolean => {
  if (!fileType) return false;

  return (
    fileType.includes('image/') ||
    fileType.includes('application/pdf') ||
    fileType.includes('text/') ||
    fileType.includes('audio/') ||
    fileType.includes('video/') ||
    fileType.includes('application/json')
  );
};

export const formatFileSize = (bytes?: number): string => {
  if (bytes === undefined) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const openFileInNewTab = async (
  fileData: FileData | null,
  fileUrl: string,
  loadFileAsBlob: () => Promise<{ blob: Blob; blobUrl: string } | null>,
) => {
  if (!fileData) return;

  // Agar fayl turi brauzerda ko'rsatib bo'lmaydigan bo'lsa, to'g'ridan-to'g'ri serverdan ochish
  if (!canPreviewInBrowser(fileData.type)) {
    window.open(fileUrl, '_blank', 'noopener,noreferrer');
    return;
  }

  // Agar blob URL mavjud bo'lsa, uni ochish
  if (fileData.blobUrl) {
    window.open(fileData.blobUrl, '_blank', 'noopener,noreferrer');
    return;
  }

  // Blobi bo'lmasa, yuklab olish
  const result = await loadFileAsBlob();
  if (result?.blobUrl) {
    window.open(result.blobUrl, '_blank', 'noopener,noreferrer');
  } else {
    // Xatolik yuz berganda, to'g'ridan-to'g'ri serverdan ochish
    window.open(fileUrl, '_blank', 'noopener,noreferrer');
  }
};
