import React, { useCallback, useMemo, useRef } from 'react';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { FileTypes } from '../models/file-upload-types';
import { useUploadFiles } from '../api/use-upload-files';
import Icon from '@/shared/components/common/icon';
import { Input } from '@/shared/components/ui/input';
import { cn } from '@/shared/lib/utils.ts';

interface InputFileProps<T extends FieldValues> {
  name: Path<T>;
  accept: FileTypes[];
  form: UseFormReturn<T>;
  className?: string;
}

export function InputFile<T extends FieldValues>({
  name,
  accept,
  form,
  className,
}: InputFileProps<T>) {
  const { setValue, watch, clearErrors } = form;
  const { mutate, isPending } = useUploadFiles();
  const fileUrls: string[] = watch(name) || [];

  const acceptTypes = useMemo(() => accept.join(','), [accept]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const openFileDialog = () => fileInputRef.current?.click();

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files ? Array.from(event.target.files) : [];
      if (files.length > 0) {
        clearErrors(name);

        mutate(files, {
          onSuccess: (data) =>
            setValue(name, [...fileUrls, ...data.urls] as any, {
              shouldValidate: true,
            }),
        });
      }
    },
    [clearErrors, mutate, setValue, name, fileUrls],
  );

  return (
    <div>
      <button
        type="button"
        onClick={openFileDialog}
        className={cn(
          'cursor-pointer inline-flex gap-2 items-center rounded-sm text-sm font-medium px-4 py-2 border border-blue-400 hover:border-blue-400/70 text-blue-400',
          className,
        )}
      >
        <Icon name="new-document" className="size-5" /> Файлни бириктириш
      </button>
      <Input
        ref={fileInputRef}
        hidden
        type="file"
        multiple
        accept={acceptTypes}
        disabled={isPending}
        onChange={handleFileChange}
      />
    </div>
  );
}
