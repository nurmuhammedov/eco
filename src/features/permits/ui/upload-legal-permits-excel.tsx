import { useRef, useState, type ChangeEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FileSpreadsheet, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { apiClient } from '@/shared/api/api-client'
import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog'
import { invalidateEndpoint } from '@/shared/lib/query/endpoint-key'

export const LEGAL_PERMITS_EXCEL_ENDPOINT = '/permits/legal/excel'

const ACCEPTED_FILES = '.xlsx,.xls'

/**
 * The proxy in front of the API gives up after a minute while the server keeps
 * going row by row, so a big file can come back as 504 and still be saved.
 */
const GATEWAY_TIMEOUT = 504

interface UploadAnswer {
  message?: string
}

/**
 * Legal entities' permits in bulk: the first sheet of the workbook, a header
 * row, then the TIN in column B and the licence register's ID in column C.
 * The server looks each one up in license.gov.uz and skips the ones it already
 * holds; it answers once the whole file is done.
 */
export const UploadLegalPermitsExcel = () => {
  const queryClient = useQueryClient()
  const fileInput = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const finish = () => {
    setFile(null)
    setOpen(false)
    return invalidateEndpoint(queryClient, '/permits')
  }

  const { mutate: upload, isPending } = useMutation({
    mutationFn: (picked: File) => {
      const formData = new FormData()
      formData.append('file', picked)

      return apiClient.post<UploadAnswer>(
        LEGAL_PERMITS_EXCEL_ENDPOINT,
        formData,
        { 'Content-Type': 'multipart/form-data' },
        undefined,
        { silentErrorStatuses: [GATEWAY_TIMEOUT] }
      )
    },
    onSuccess: (response) => {
      toast.success(response.data?.message || 'Fayl muvaffaqiyatli yuklandi')
      return finish()
    },
    onError: (error: { status?: number }) => {
      // Every other failure has already been shown by the shared interceptor
      if (error?.status !== GATEWAY_TIMEOUT) return

      toast.warning(
        'Fayl katta, server uni qayta ishlashda davom etmoqda. Bir necha daqiqadan so‘ng ro‘yxatni yangilang.',
        { duration: 10000 }
      )
      return finish()
    },
  })

  const pickFile = (event: ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] ?? null)
    // The same file may be picked again after a failed upload
    event.target.value = ''
  }

  const onOpenChange = (next: boolean) => {
    // Closing mid-upload would hide the answer; the server carries on either way
    if (isPending) return
    setOpen(next)
    if (!next) setFile(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className="w-full sm:w-auto">
          <FileSpreadsheet className="h-4 w-4" />
          Excel orqali yuklash
        </Button>
      </DialogTrigger>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>Excel orqali yuklash</DialogTitle>
          <DialogDescription>Yuridik shaxslarning ruxsat etuvchi hujjatlari</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-sm text-gray-700">
          <ul className="list-disc space-y-1 pl-5">
            <li>Faylning birinchi varag‘i o‘qiladi, birinchi qator sarlavha hisoblanadi.</li>
            <li>
              <b>B</b> ustun — tashkilot STIR (INN), <b>C</b> ustun — license.gov.uz dagi ro‘yxat ID raqami.
            </li>
            <li>Ma’lumotlar license.gov.uz dan olinadi; tizimda bor hujjatlar qayta qo‘shilmaydi.</li>
          </ul>

          <input ref={fileInput} type="file" accept={ACCEPTED_FILES} className="hidden" onChange={pickFile} />
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start"
            disabled={isPending}
            onClick={() => fileInput.current?.click()}
          >
            <Upload className="h-4 w-4" />
            <span className="truncate">{file ? file.name : 'Faylni tanlang (.xlsx, .xls)'}</span>
          </Button>

          {isPending && (
            <p className="text-xs text-gray-500">
              Fayl qayta ishlanmoqda. Qatorlar ko‘p bo‘lsa, bir necha daqiqa davom etishi mumkin.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button type="button" disabled={!file} loading={isPending} onClick={() => file && upload(file)}>
            Yuklash
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
