import { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Lock, Video } from 'lucide-react'
import { Badge } from '@/shared/components/ui/badge'
import { InputFile } from '@/shared/components/common/file-upload'
import { FileTypes } from '@/shared/components/common/file-upload/model/file-types'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog'
import { apiConfig } from '@/shared/api/constants'
import { SERVICES_API_ENDPOINTS } from '@/shared/api/endpoints'
import type { AttestationCalendar } from '@/entities/attestation/model/types'
import { invalidateAttestation } from '@/entities/attestation/lib/invalidate'
import { useDeleteSessionVideo } from '../model/use-applicants'

/** Mirrors video_max_size_kb in the Laravel attestation config */
const VIDEO_MAX_SIZE_MB = 1024

const servicesBase = String(apiConfig.servicesURL ?? '').replace(/\/$/, '')

type FormValues = { video: string }

/**
 * One recording per exam. The upload attaches it on the server straight away,
 * so there is no separate save step.
 */
export const ExamVideo = ({ calendar }: { calendar: AttestationCalendar }) => {
  const queryClient = useQueryClient()
  const deleteVideo = useDeleteSessionVideo()
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const isDeleting = useRef(false)

  const savedUrl = calendar.video_url ? `${servicesBase}${calendar.video_url}` : ''
  const form = useForm<FormValues>({ defaultValues: { video: savedUrl } })

  const restore = useCallback(() => form.reset({ video: savedUrl }), [form, savedUrl])

  useEffect(() => {
    restore()
  }, [restore])

  const handleOpenChange = (open: boolean) => {
    setIsConfirmOpen(open)

    // Escape, a click outside and the cancel button all end up here
    if (!open && !isDeleting.current) restore()
    isDeleting.current = false
  }

  const handleDelete = () => {
    isDeleting.current = true
    deleteVideo.mutate(calendar.id, { onError: restore })
  }

  // Evidence for an appeal: once the exam is over and the recording is in, it stays for three years
  if (calendar.video_locked && savedUrl) {
    return (
      <div className="flex w-80 items-center gap-2 rounded border border-gray-200 bg-white px-2.5 py-1.5 text-sm">
        <Video className="h-4 w-4 shrink-0 text-blue-400" />
        <a
          href={savedUrl}
          target="_blank"
          rel="noreferrer"
          className="truncate text-blue-500 hover:underline"
          title={calendar.video_name ?? undefined}
        >
          {calendar.video_name || 'Suhbat videosi'}
        </a>
        <Badge
          variant="secondary"
          className="ml-auto shrink-0 gap-1"
          title="Imtihon yakunlangan: video apellyatsiya uchun saqlanadi, uni almashtirib yoki o‘chirib bo‘lmaydi"
        >
          <Lock className="h-3 w-3" />3 yil saqlanadi
        </Badge>
      </div>
    )
  }

  return (
    <>
      <InputFile
        form={form}
        name="video"
        accept={[FileTypes.VIDEO]}
        maxSize={VIDEO_MAX_SIZE_MB}
        uploadClient="services"
        uploadEndpoint={SERVICES_API_ENDPOINTS.CALENDAR_VIDEO(calendar.id)}
        buttonText="Suhbat videosini yuklash"
        maxFilenameLength={32}
        className="w-80"
        onUploadComplete={() => {
          toast.success('Video yuklandi')
          invalidateAttestation(queryClient)
        }}
        // The field has already emptied itself; the file stays until this is confirmed
        onRemove={() => setIsConfirmOpen(true)}
      />

      <AlertDialog open={isConfirmOpen} onOpenChange={handleOpenChange}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Videoni o‘chirish</AlertDialogTitle>
            <AlertDialogDescription>Suhbat yozuvi serverdan butunlay o‘chiriladi.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDelete}>
              O‘chirish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
