import { onActivate } from '@/shared/lib/on-activate'
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FieldValues, Path, PathValue, UseFormReturn } from 'react-hook-form'
import { AxiosProgressEvent } from 'axios'
import { Camera, Paperclip } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { Input } from '@/shared/components/ui/input'
import { FileIcon } from './file-icon'
import { FileControls } from './file-controls'
import { FileTypes } from '../models/file-types'
import { useUploadFiles } from '../api/use-upload-files'
import { FileData } from '../models/file-data.interface'
import { formatFileSize, openFileInNewTab, truncateFilename } from '../lib/utils'

export interface InputFileProps<T extends FieldValues> {
  name: Path<T>
  form: UseFormReturn<T>
  accept?: FileTypes[]
  className?: string
  maxSize?: number
  disabled?: boolean
  showPreview?: boolean
  showFileSize?: boolean
  showDownload?: boolean
  showCameraOption?: boolean
  uploadEndpoint?: string
  multiple?: boolean
  maxFiles?: number
  buttonText?: string
  /** Supplied by FormControl so the field label can target the visible control */
  id?: string
  maxFilenameLength?: number
  onUploadStart?: () => void
  onUploadComplete?: (urls: string) => void
  onUploadError?: (error: Error) => void
  onUploadProgress?: (progress: number) => void
  onRemove?: () => void
}

interface FileRowProps {
  fileData: FileData
  isLoading?: boolean
  progress?: number
  hasError?: boolean
  showPreview?: boolean
  showDownload?: boolean
  showFileSize?: boolean
  maxFilenameLength: number
  onRemove: () => void
  onPreview: () => void
}

const FileRow = memo(
  ({
    fileData,
    isLoading,
    progress,
    hasError,
    showPreview,
    showDownload,
    showFileSize,
    maxFilenameLength,
    onRemove,
    onPreview,
  }: FileRowProps) => {
    const displayFileName = useMemo(
      () => truncateFilename(fileData.originalName || 'Nomsiz fayl', maxFilenameLength),
      [fileData.originalName, maxFilenameLength]
    )

    return (
      <div
        className={cn(
          'flex w-full items-center overflow-hidden rounded border bg-white transition-all duration-150',
          hasError ? 'border-red-300' : 'border-gray-200 hover:border-blue-400',
          'mb-2 last:mb-0'
        )}
      >
        <div className="flex h-9 items-center justify-center border-r border-gray-100 bg-gray-50 px-2.5 text-blue-400">
          {isLoading ? (
            <div className="size-4 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />
          ) : (
            <FileIcon fileType={fileData.type} className="text-blue-400" />
          )}
        </div>

        <button
          type="button"
          disabled={isLoading}
          onClick={onPreview}
          className="flex flex-grow items-center justify-between px-3 py-2 text-left text-sm font-medium"
        >
          {isLoading ? (
            <span className="text-gray-400">{`Yuklanmoqda (${progress}%)`}</span>
          ) : (
            <>
              <span className="cursor-pointer truncate text-blue-400 hover:underline" title={fileData.originalName}>
                {displayFileName}
              </span>
              {showFileSize && fileData.size && (
                <span className="ml-2 flex-shrink-0 text-xs text-gray-500">{formatFileSize(fileData.size)}</span>
              )}
            </>
          )}
        </button>

        {!isLoading && (
          <FileControls
            fileData={fileData}
            fileUrl={fileData.url}
            isLoading={!!isLoading}
            showPreview={showPreview}
            showDownload={showDownload}
            onPreviewClick={onPreview}
            onRemoveClick={onRemove}
          />
        )}
      </div>
    )
  }
)
FileRow.displayName = 'FileRow'

function InputFileComponent<T extends FieldValues>({
  name,
  form,
  className,
  maxSize = 10,
  disabled = false,
  showPreview = false,
  showFileSize = false,
  showDownload = false,
  showCameraOption = false,
  accept = [FileTypes.PDF],
  uploadEndpoint,
  multiple = false,
  maxFiles = 10,
  buttonText = 'Fayl biriktirish',
  id,
  maxFilenameLength = 20,
  onUploadStart,
  onUploadComplete,
  onUploadError,
  onUploadProgress,
  onRemove,
}: InputFileProps<T>) {
  const {
    setValue,
    watch,
    clearErrors,
    setError,
    formState: { errors },
  } = form

  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [fileList, setFileList] = useState<FileData[]>([])

  const formValue = watch(name)

  /**
   * The effects below run on form changes and on unmount, so neither of them
   * can read `fileList` from its own closure without going stale: the sync
   * effect would lose blob URLs added since the last form change, and the
   * unmount cleanup would only ever see the empty list captured at mount.
   */
  const fileListRef = useRef<FileData[]>(fileList)

  useEffect(() => {
    fileListRef.current = fileList
  }, [fileList])

  useEffect(() => {
    const currentUrls = Array.isArray(formValue) ? formValue : formValue ? [formValue] : []
    const previous = fileListRef.current

    if (currentUrls.length === 0) {
      if (previous.length === 0) return
      previous.forEach((file) => file.blobUrl && URL.revokeObjectURL(file.blobUrl))
      setFileList([])

      return
    }

    const next = currentUrls.map(
      (url: any) =>
        previous.find((file) => file.url === url) ??
        ({
          url,
          originalName: typeof url === 'string' ? url.split('/').pop() || 'Nomsiz fayl' : 'Fayl',
        } as FileData)
    )

    if (next.length !== previous.length || next.some((file, index) => file.url !== previous[index].url)) {
      setFileList(next)
    }
  }, [formValue])

  useEffect(
    () => () => {
      fileListRef.current.forEach((file) => {
        if (file.blobUrl) URL.revokeObjectURL(file.blobUrl)
      })
    },
    []
  )

  const hasError = !!errors[name]
  const acceptTypes = useMemo(() => accept.join(','), [accept])

  const handleUploadProgress = useCallback(
    (progressEvent: AxiosProgressEvent) => {
      const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1))
      setUploadProgress(percent)
      onUploadProgress?.(percent)
    },
    [onUploadProgress]
  )

  const { mutate, isPending } = useUploadFiles({
    endpoint: uploadEndpoint,
    onUploadProgress: handleUploadProgress,
  })

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const cameraInputRef = useRef<HTMLInputElement | null>(null)

  const openFileDialog = useCallback(() => {
    if (!disabled && !isPending) {
      if (multiple && fileList.length >= maxFiles) return
      fileInputRef.current?.click()
    }
  }, [disabled, isPending, multiple, fileList.length, maxFiles])

  const openCameraDialog = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation()
      if (!disabled && !isPending) {
        if (multiple && fileList.length >= maxFiles) return
        cameraInputRef.current?.click()
      }
    },
    [disabled, isPending, multiple, fileList.length, maxFiles]
  )

  const validateFile = useCallback(
    (file: File): boolean => {
      const type = file.type
      const match = type.match(/^([^/]+)/)
      const typeMatch = match ? match[1] : ''
      const isImage = typeMatch === 'image'

      if (acceptTypes.includes(FileTypes.IMAGE) && isImage) return true

      if (!accept.includes(type as FileTypes) && !accept.some((t) => type.includes(t.replace('/*', '')))) {
        setError(name, { type: 'type', message: 'Fayl formati noto‘g‘ri' })
        return false
      }

      if (file.size > maxSize * 1024 * 1024) {
        setError(name, { type: 'size', message: `Fayl hajmi ${maxSize}MB dan oshmasligi kerak` })
        return false
      }
      return true
    },
    [maxSize, name, setError, acceptTypes, accept]
  )

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files
      if (!files || files.length === 0) return

      const filesArray = Array.from(files)

      if (multiple && fileList.length + filesArray.length > maxFiles) {
        setError(name, { type: 'maxFiles', message: `Maksimal ${maxFiles} ta fayl yuklash mumkin` })
        return
      }

      const validFiles = filesArray.filter(validateFile)
      if (validFiles.length === 0) {
        if (event.target) event.target.value = ''
        return
      }

      clearErrors(name)
      onUploadStart?.()
      setUploadProgress(0)

      const tempFilesData: FileData[] = validFiles.map((file) => ({
        url: '',
        originalName: file.name,
        size: file.size,
        type: file.type,
        blob: file,
        blobUrl: URL.createObjectURL(file),
      }))

      mutate(validFiles, {
        onSuccess: (responseUrls) => {
          const newUrls = Array.isArray(responseUrls) ? responseUrls : [responseUrls]

          if (multiple) {
            const currentVal = (watch(name) as string[]) || []
            const updatedUrls = [...currentVal, ...newUrls]
            setValue(name, updatedUrls as PathValue<T, Path<T>>, { shouldValidate: true })
            onUploadComplete?.(updatedUrls as unknown as string)
          } else {
            const url = newUrls[0]
            setValue(name, url as PathValue<T, Path<T>>, { shouldValidate: true })
            onUploadComplete?.(url)
          }
        },
        onError: (error) => {
          tempFilesData.forEach((f) => f.blobUrl && URL.revokeObjectURL(f.blobUrl))
          setError(name, { type: 'upload', message: error.message || 'Fayl yuklashda xatolik' })
          onUploadError?.(error)
        },
      })

      if (event.target) event.target.value = ''
    },
    [
      clearErrors,
      mutate,
      setValue,
      name,
      validateFile,
      onUploadStart,
      onUploadComplete,
      onUploadError,
      setError,
      multiple,
      fileList.length,
      maxFiles,
      watch,
    ]
  )

  const removeFile = useCallback(
    (indexToRemove: number) => {
      const fileToRemove = fileList[indexToRemove]
      if (fileToRemove?.blobUrl) URL.revokeObjectURL(fileToRemove.blobUrl)

      if (multiple) {
        const currentUrls = (watch(name) as string[]) || []
        const newUrls = currentUrls.filter((_, index) => index !== indexToRemove)
        setValue(name, newUrls as PathValue<T, Path<T>>, { shouldValidate: true })
      } else {
        setValue(name, '' as unknown as PathValue<T, Path<T>>, { shouldValidate: true })
      }
      onRemove?.()
    },
    [setValue, name, fileList, multiple, watch, onRemove]
  )

  const handleOpenFile = useCallback((fileData: FileData) => {
    openFileInNewTab(fileData, fileData.url, async () => {
      if (fileData.blob) return { blob: fileData.blob, blobUrl: fileData.blobUrl! }
      try {
        const res = await fetch(fileData.url)
        const blob = await res.blob()
        return { blob, blobUrl: URL.createObjectURL(blob) }
      } catch {
        return null
      }
    }).catch((err) => console.error(err))
  }, [])

  return (
    <div className={cn('file-upload-wrapper', className)}>
      {(multiple || fileList.length === 0) && (
        <div className="flex w-full gap-2">
          <div
            id={id}
            onClick={openFileDialog}
            role="button"
            tabIndex={0}
            onKeyDown={onActivate(openFileDialog)}
            className={cn(
              'flex h-9 flex-1 items-center',
              'overflow-hidden rounded border border-dashed bg-white',
              'cursor-pointer transition-all duration-150 ease-in-out',
              hasError ? 'border-red-300' : 'border-blue-300 hover:border-blue-500 hover:bg-blue-50',
              isPending && 'cursor-not-allowed opacity-50'
            )}
          >
            <div className="flex h-9 items-center justify-center border-r border-transparent px-2.5">
              {isPending ? (
                <div className="size-4 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />
              ) : (
                <Paperclip className="size-4 text-blue-400" />
              )}
            </div>
            <div className="flex-grow truncate px-3 py-2 text-sm font-medium whitespace-nowrap text-blue-400">
              {isPending ? `Yuklanmoqda... (${uploadProgress}%)` : buttonText}
            </div>
          </div>

          {showCameraOption && (
            <div
              onClick={openCameraDialog}
              role="button"
              tabIndex={0}
              onKeyDown={onActivate(openCameraDialog)}
              className={cn(
                'flex items-center justify-center px-4',
                'overflow-hidden rounded border border-dashed bg-white',
                'cursor-pointer transition-all duration-150 ease-in-out',
                hasError ? 'border-red-300' : 'border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50',
                isPending && 'cursor-not-allowed opacity-50'
              )}
              title="Rasmga olish"
            >
              {isPending ? (
                <div className="size-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
              ) : (
                <>
                  <Camera className="mr-2 size-4 text-emerald-600" />
                  <span className="text-sm font-medium whitespace-nowrap text-emerald-600">Rasmga olish</span>
                </>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col gap-1">
        {fileList.map((file, index) => (
          <FileRow
            key={`${file.url}-${index}`}
            fileData={file}
            maxFilenameLength={maxFilenameLength}
            showPreview={showPreview}
            showDownload={showDownload}
            showFileSize={showFileSize}
            onRemove={() => removeFile(index)}
            onPreview={() => handleOpenFile(file)}
          />
        ))}
      </div>

      <Input
        ref={fileInputRef}
        hidden
        allowCyrillic={true}
        type="file"
        multiple={multiple}
        accept={acceptTypes}
        disabled={disabled || isPending}
        onChange={handleFileChange}
      />

      {showCameraOption && (
        <Input
          ref={cameraInputRef}
          hidden
          allowCyrillic={true}
          type="file"
          accept="image/*"
          capture="environment"
          disabled={disabled || isPending}
          onChange={handleFileChange}
        />
      )}

      {hasError && errors[name]?.message && (
        <p className="mt-1 text-xs text-red-500">{errors[name]?.message as string}</p>
      )}
    </div>
  )
}

export const InputFile = memo(InputFileComponent) as typeof InputFileComponent
