import { FileIcon } from './file-icon'
import { cn } from '@/shared/lib/utils'
import { AxiosProgressEvent } from 'axios'
import { FilePlus } from 'lucide-react'
import { FileControls } from './file-controls'
import { FileTypes } from '../models/file-types'
import { Input } from '@/shared/components/ui/input'
import { useUploadFiles } from '../api/use-upload-files'
import { FileData } from '../models/file-data.interface'
import { FieldValues, Path, PathValue, UseFormReturn } from 'react-hook-form'
import { formatFileSize, openFileInNewTab, truncateFilename } from '../lib/utils'
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'

export interface InputFileProps<T extends FieldValues> {
  name: Path<T>
  accept?: FileTypes[]
  form: UseFormReturn<T>
  className?: string
  maxSize?: number // MB da
  disabled?: boolean
  showPreview?: boolean
  showFileSize?: boolean
  showDownload?: boolean
  uploadEndpoint?: string
  onUploadStart?: () => void
  onUploadComplete?: (url: string) => void
  onUploadError?: (error: Error) => void
  onUploadProgress?: (progress: number) => void
  buttonText?: string
  maxFilenameLength?: number
}

function InputFileComponent<T extends FieldValues>({
  name,
  form,
  className,
  maxSize = 10, // 10MB default
  disabled = false,
  showPreview = false,
  showFileSize = false,
  showDownload = false,
  accept = [FileTypes.PDF],
  uploadEndpoint,
  onUploadStart,
  onUploadComplete,
  onUploadError,
  onUploadProgress,
  buttonText = 'Faylni biriktirish',
  maxFilenameLength = 20,
}: InputFileProps<T>) {
  const {
    setValue,
    watch,
    clearErrors,
    setError,
    formState: { errors },
  } = form
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [fileData, setFileData] = useState<FileData | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Form watch qiladi URL qiymatini
  const fileUrl: string = (watch(name) as string) || ''

  // Fayl ma'lumotlarini URL o'zgarganda sinxronlash
  useEffect(() => {
    if (!fileUrl && fileData) {
      // Blob URL ni tozalash
      if (fileData.blobUrl) {
        URL.revokeObjectURL(fileData.blobUrl)
      }
      setFileData(null)
      return
    }

    if (fileUrl && (!fileData || fileData.url !== fileUrl)) {
      setFileData({
        url: fileUrl,
        originalName: fileUrl.split('/').pop() || 'Nomsiz fayl',
      })
    }
  }, [fileUrl, fileData])

  // Komponent o'chirilganda blob URLni tozalash
  useEffect(() => {
    return () => {
      if (fileData?.blobUrl) {
        URL.revokeObjectURL(fileData.blobUrl)
      }
    }
  }, [fileData])

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

  const openFileDialog = useCallback(() => {
    if (!disabled && !isPending) {
      fileInputRef.current?.click()
    }
  }, [disabled, isPending])

  const validateFile = useCallback(
    (file: File): boolean => {
      const type = file.type

      const match = type.match(/^([^/]+)/)
      const typeMatch = match ? match[1] : ''
      const isImage = typeMatch === 'image'

      if (acceptTypes.includes(FileTypes.IMAGE) && isImage) {
        return true
      }

      if (!accept.includes(type as FileTypes)) {
        setError(name, {
          type: 'type',
          message: `Fayl type error`,
        })
        return false
      }

      if (file.size > maxSize * 1024 * 1024) {
        setError(name, {
          type: 'size',
          message: `Fayl hajmi ${maxSize}MB dan oshmasligi kerak`,
        })
        return false
      }
      return true
    },
    [maxSize, name, setError]
  )

  // Faylni Blob sifatida yuklash
  const loadFileAsBlob = useCallback(async () => {
    if (!fileUrl || !fileData || fileData.blob) return null

    try {
      setIsLoading(true)

      const response = await fetch(fileUrl)
      if (!response.ok) throw new Error('Faylni yuklashda xatolik')

      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)

      // FileData ni yangilash
      setFileData((prev) => {
        if (prev?.blobUrl) {
          // Eski blob URL ni tozalash
          URL.revokeObjectURL(prev.blobUrl)
        }
        return prev ? { ...prev, blob, blobUrl } : null
      })

      setIsLoading(false)
      return { blob, blobUrl }
    } catch (error) {
      console.error('Faylni yuklashda xatolik:', error)
      setIsLoading(false)
      return null
    }
  }, [fileUrl, fileData])

  // Faylni yangi oynada ochish uchun utility funksiyani chaqirish
  const handleOpenFileInNewTab = useCallback(() => {
    openFileInNewTab(fileData, fileUrl, loadFileAsBlob)
  }, [fileData, fileUrl, loadFileAsBlob])

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files

      if (files && files.length > 0) {
        const file = files[0]

        if (!validateFile(file)) {
          return
        }

        const blobUrl = URL.createObjectURL(file)

        const fileInfo = {
          originalName: file.name,
          size: file.size,
          type: file.type,
          blob: file,
          blobUrl,
        }

        clearErrors(name)
        onUploadStart?.()
        setUploadProgress(0)

        mutate([file], {
          onSuccess: (url) => {
            if (url && url.length > 0) {
              setValue(name, url as PathValue<T, Path<T>>, { shouldValidate: true })

              setFileData({
                url,
                originalName: fileInfo.originalName,
                size: fileInfo.size,
                type: fileInfo.type,
                blob: file,
                blobUrl,
              })

              onUploadComplete?.(url)
            }
          },
          onError: (error) => {
            // Blob URL ni tozalash
            URL.revokeObjectURL(blobUrl)

            setError(name, {
              type: 'upload',
              message: error.message || 'Fayl yuklashda xatolik',
            })
            onUploadError?.(error)
          },
        })
      }

      if (event.target) {
        event.target.value = ''
      }
    },
    [clearErrors, mutate, setValue, name, validateFile, onUploadStart, onUploadComplete, onUploadError, setError]
  )

  const removeFile = useCallback(() => {
    // Blob URL ni tozalash
    if (fileData?.blobUrl) {
      URL.revokeObjectURL(fileData.blobUrl)
    }

    setValue(name, '' as unknown as PathValue<T, Path<T>>, { shouldValidate: true })
  }, [setValue, name, fileData])

  const showFileName = fileUrl && fileData?.originalName

  // Fayl nomini qisqartirish
  const displayFileName = useMemo(() => {
    if (!fileData?.originalName) return ''
    return truncateFilename(fileData.originalName, maxFilenameLength)
  }, [fileData?.originalName, maxFilenameLength])

  return (
    <div className="file-upload-container relative">
      <div
        className={cn(
          'flex w-full items-center',
          'overflow-hidden rounded border bg-white',
          'transition-all duration-150 ease-in-out',
          hasError ? 'border-red-300' : 'border-blue-400',
          'hover:border-blue-400',
          className
        )}
      >
        {/* Fayl ikonkasi */}
        <div className="flex h-9 items-center justify-center border-r border-gray-100 bg-gray-50 px-2.5 text-blue-400">
          {isPending ? (
            <div className="size-4 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />
          ) : showFileName ? (
            <FileIcon fileType={fileData?.type} className="text-blue-400" />
          ) : (
            <FilePlus className="size-4 text-blue-400" />
          )}
        </div>

        {/* Fayl nomi yoki buttonText */}
        <div
          onClick={!showFileName ? openFileDialog : undefined}
          className={cn(
            'flex-grow cursor-pointer truncate px-3 py-2 text-sm font-medium',
            'transition-colors duration-150',
            isPending && 'text-gray-400',
            !showFileName && 'hover:bg-gray-50'
          )}
        >
          {isPending ? (
            <span>{`Yuklanmoqda (${uploadProgress}%)`}</span>
          ) : (
            <div className="flex items-center justify-between">
              <span
                className={cn('truncate', showFileName ? 'font-medium text-blue-400' : 'text-blue-400')}
                title={showFileName ? fileData?.originalName : buttonText}
              >
                {showFileName ? displayFileName : buttonText}
              </span>

              {showFileSize && fileData?.size && (
                <span className="ml-2 flex-shrink-0 text-xs whitespace-nowrap text-gray-500">
                  {formatFileSize(fileData.size)}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Boshqaruv tugmalari */}
        {showFileName && !isPending && (
          <FileControls
            fileData={fileData}
            fileUrl={fileUrl}
            isLoading={isLoading}
            showPreview={showPreview}
            showDownload={showDownload}
            onPreviewClick={handleOpenFileInNewTab}
            onRemoveClick={removeFile}
          />
        )}
      </div>

      <Input
        ref={fileInputRef}
        hidden
        type="file"
        multiple={false}
        accept={acceptTypes}
        disabled={disabled || isPending}
        onChange={handleFileChange}
      />

      {hasError && errors[name]?.message && (
        <p className="mt-1 text-xs text-red-500">{errors[name]?.message as string}</p>
      )}
    </div>
  )
}

// Memo bilan optimizatsiya
export const InputFile = memo(InputFileComponent) as typeof InputFileComponent
