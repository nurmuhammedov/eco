import { cn } from '@/shared/lib/utils';
import Icon from '@/shared/components/common/icon';
import { Input } from '@/shared/components/ui/input';
import { FileTypes } from '../models/file-upload-types';
import { useUploadFiles } from '../api/use-upload-files';
import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { AxiosProgressEvent } from 'axios';

// Fayl ma'lumotlari interfeysi
interface FileData {
  url: string;
  originalName: string;
  size?: number;
  type?: string;
}

export interface InputFileProps<T extends FieldValues> {
  name: Path<T>;
  accept: FileTypes[];
  form: UseFormReturn<T>;
  className?: string;
  maxSize?: number; // MB da
  maxFiles?: number;
  disabled?: boolean;
  multiple?: boolean;
  showPreview?: boolean;
  uploadEndpoint?: string;
  onUploadStart?: () => void;
  onUploadComplete?: (urls: string[]) => void;
  onUploadError?: (error: Error) => void;
  onUploadProgress?: (progress: number) => void;
  buttonText?: string;
  buttonIcon?: string;
}

function InputFileComponent<T extends FieldValues>({
  name,
  accept,
  form,
  className,
  maxSize = 10, // 10MB default
  maxFiles = 1,
  disabled = false,
  multiple = true,
  showPreview = false,
  uploadEndpoint,
  onUploadStart,
  onUploadComplete,
  onUploadError,
  onUploadProgress,
  buttonText = 'Faylni biriktirish',
  buttonIcon = 'new-document',
}: InputFileProps<T>) {
  const {
    setValue,
    watch,
    clearErrors,
    setError,
    formState: { errors },
  } = form;
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [fileDataList, setFileDataList] = useState<FileData[]>([]);

  // Form watch qiladi faqat URL massivini
  const urls: string[] = watch(name) || [];

  // Fayl ma'lumotlarini har safar URLs o'zgarganda sinxronlash
  React.useEffect(() => {
    // URLs va fileDataList sinxronizatsiyasini ta'minlash
    // Faqat URL ro'yxati o'zgarganda, fayl ma'lumotlari ro'yxatini yangilash
    if (urls.length !== fileDataList.length) {
      // URLs ni tekshirish va o'chirilgan yoki qo'shilgan elementlarni aniqlash

      // Agar URLs massivi kamaygan bo'lsa, fayl o'chirilgan
      if (urls.length < fileDataList.length) {
        const newFileDataList = fileDataList.filter((fileData) => urls.includes(fileData.url));
        setFileDataList(newFileDataList);
      }
      // Yangi URLlar haqida ma'lumot bo'lmasa, ba'zi asosiy ma'lumotlar bilan to'ldirish
      else if (urls.length > fileDataList.length) {
        const existingUrls = fileDataList.map((item) => item.url);
        const newUrls = urls.filter((url) => !existingUrls.includes(url));

        const newFileDataItems = newUrls.map((url) => ({
          url,
          originalName: url.split('/').pop() || 'Nomsiz fayl',
        }));

        setFileDataList((prevData) => [...prevData, ...newFileDataItems]);
      }
    }
  }, [urls, fileDataList]);

  const hasError = !!errors[name];
  const acceptTypes = useMemo(() => accept.join(','), [accept]);

  const handleUploadProgress = useCallback(
    (progressEvent: AxiosProgressEvent) => {
      const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
      setUploadProgress(percent);
      onUploadProgress?.(percent);
    },
    [onUploadProgress],
  );

  const { mutate, isPending } = useUploadFiles({
    endpoint: uploadEndpoint,
    onUploadProgress: handleUploadProgress,
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const openFileDialog = useCallback(() => {
    if (!disabled && !isPending) {
      fileInputRef.current?.click();
    }
  }, [disabled, isPending]);

  const validateFiles = useCallback(
    (files: File[]): boolean => {
      // Fayl hajmini tekshirish
      const oversizedFile = files.find((file) => file.size > maxSize * 1024 * 1024);
      if (oversizedFile) {
        setError(name, {
          type: 'size',
          message: `Fayl hajmi ${maxSize}MB dan oshmasligi kerak`,
        });
        return false;
      }

      // Fayllar sonini tekshirish
      if (maxFiles && urls.length + files.length > maxFiles) {
        setError(name, {
          type: 'maxFiles',
          message: `Maksimal ${maxFiles} ta fayl yuklash mumkin`,
        });
        return false;
      }

      return true;
    },
    [maxSize, maxFiles, urls.length, name, setError],
  );

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files ? Array.from(event.target.files) : [];

      if (files.length > 0) {
        // Fayllarni validatsiya qilish
        if (!validateFiles(files)) {
          return;
        }

        // Fayllar haqida to'liq ma'lumot saqlash
        const filesInfo = files.map((file) => ({
          originalName: file.name,
          size: file.size,
          type: file.type,
        }));

        clearErrors(name);
        onUploadStart?.();
        setUploadProgress(0);

        mutate(files, {
          onSuccess: (data) => {
            // Yangi URLlar
            const newUrls = [...urls, ...data];

            // Form qiymatini yangilash (faqat URL massivi)
            setValue(name, newUrls, {
              shouldValidate: true,
            });

            // Fayl ma'lumotlari ro'yxatini yangilash
            const newFileData: FileData[] = Array.isArray(data)
              ? data.map((url, index) => ({
                  url,
                  originalName: filesInfo[index].originalName,
                  size: filesInfo[index].size,
                  type: filesInfo[index].type,
                }))
              : [];

            setFileDataList((prevData) => [...prevData, ...newFileData]);

            onUploadComplete?.(data);
          },
          onError: (error) => {
            setError(name, {
              type: 'upload',
              message: error.message || 'Fayl yuklashda xatolik',
            });
            onUploadError?.(error);
          },
        });
      }

      // Input qiymatini tozalash, keyingi upload uchun
      if (event.target) {
        event.target.value = '';
      }
    },
    [
      clearErrors,
      mutate,
      setValue,
      name,
      urls,
      validateFiles,
      onUploadStart,
      onUploadComplete,
      onUploadError,
      setError,
    ],
  );

  const removeFile = useCallback(
    (index: number) => {
      // URL ni o'chirish
      const newUrls = [...urls];
      newUrls.splice(index, 1);

      // Form qiymatini yangilash
      setValue(name, newUrls, { shouldValidate: true });

      // fileDataList useEffect orqali avtomatik yangilanadi
    },
    [urls, setValue, name],
  );

  // Button textni hisoblash
  const getButtonText = useCallback(() => {
    if (isPending) {
      return `Yuklanmoqda (${uploadProgress}%)`;
    }

    if (urls.length > 0 && fileDataList.length > 0) {
      // Agar faqat bitta fayl bo'lsa, fayl nomini ko'rsatish
      if (urls.length === 1 && fileDataList[0]) {
        return fileDataList[0].originalName;
      }
      // Ko'p fayl bo'lsa, sanini ko'rsatish
      return `${urls.length} ta fayl biriktirilgan`;
    }

    return buttonText;
  }, [isPending, uploadProgress, urls.length, fileDataList, buttonText]);

  const formatFileSize = useCallback((bytes?: number): string => {
    if (bytes === undefined) return '';

    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }, []);

  return (
    <div className="file-upload-container">
      <button
        type="button"
        onClick={openFileDialog}
        disabled={disabled || isPending}
        className={cn(
          'cursor-pointer inline-flex gap-2 items-center rounded-sm text-sm font-medium px-4 py-2 border',
          'border-blue-400 hover:border-blue-400/70 text-blue-400',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          hasError && 'border-red-500 text-red-500',
          isPending && 'animate-pulse',
          className,
        )}
        aria-busy={isPending}
        title={getButtonText()}
      >
        <Icon name={buttonIcon} className="size-5" />
        <span className="truncate max-w-xs">{getButtonText()}</span>
      </button>

      <Input
        ref={fileInputRef}
        hidden
        type="file"
        multiple={multiple}
        accept={acceptTypes}
        disabled={disabled || isPending}
        onChange={handleFileChange}
        data-testid="file-input"
      />

      {hasError && errors[name]?.message && (
        <p className="text-red-500 text-sm mt-1">{errors[name]?.message as string}</p>
      )}

      {showPreview && urls.length > 0 && (
        <div className="mt-3 space-y-2">
          {urls.map((url, index) => {
            const fileData = fileDataList.find((item) => item.url === url) || {
              url,
              originalName: url.split('/').pop() || 'Unknown File',
            };

            return (
              <div key={`${url}`} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex flex-col">
                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 truncate max-w-xs">
                    {fileData.originalName}
                  </a>
                  {fileData.size && <span className="text-xs text-gray-500">{formatFileSize(fileData.size)}</span>}
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700"
                  aria-label="Remove file"
                >
                  <Icon name="trash" className="size-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Memo bilan optimizatsiya
export const InputFile = memo(InputFileComponent) as typeof InputFileComponent;
