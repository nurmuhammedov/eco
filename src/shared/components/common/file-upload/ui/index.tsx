import { cn } from '@/shared/lib/utils';
import Icon from '@/shared/components/common/icon';
import { Input } from '@/shared/components/ui/input';
import { FileTypes } from '../models/file-upload-types';
import { useUploadFiles } from '../api/use-upload-files';
import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { AxiosProgressEvent } from 'axios';

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

  const fileUrls: string[] = watch(name) || [];
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
      if (maxFiles && fileUrls.length + files.length > maxFiles) {
        setError(name, {
          type: 'maxFiles',
          message: `Maksimal ${maxFiles} ta fayl yuklash mumkin`,
        });
        return false;
      }

      return true;
    },
    [maxSize, maxFiles, fileUrls.length, name, setError],
  );

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files ? Array.from(event.target.files) : [];

      if (files.length > 0) {
        // Fayllarni validatsiya qilish
        if (!validateFiles(files)) {
          return;
        }

        clearErrors(name);
        onUploadStart?.();
        setUploadProgress(0);

        mutate(files, {
          onSuccess: (data) => {
            const newUrls = [...fileUrls, ...data] as any;
            setValue(name, newUrls, {
              shouldValidate: true,
            });
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
      fileUrls,
      validateFiles,
      onUploadStart,
      onUploadComplete,
      onUploadError,
      setError,
    ],
  );

  const removeFile = useCallback(
    (index: number) => {
      const newUrls = [...fileUrls];
      newUrls.splice(index, 1);
      setValue(name, newUrls as any, { shouldValidate: true });
    },
    [fileUrls, setValue, name],
  );

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
      >
        <Icon name={buttonIcon} className="size-5" />
        {isPending ? `Yuklanmoqda (${uploadProgress}%)` : buttonText}
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

      {showPreview && fileUrls.length > 0 && (
        <div className="mt-3 space-y-2">
          {fileUrls.map((url, index) => (
            <div key={`${url}-${index}`} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 truncate max-w-xs">
                {url.split('/').pop()}
              </a>
              <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700">
                <Icon name="trash" className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Memo bilan optimizatsiya
export const InputFile = memo(InputFileComponent) as typeof InputFileComponent;
