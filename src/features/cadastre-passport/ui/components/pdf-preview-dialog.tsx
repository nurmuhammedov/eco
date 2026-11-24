import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { FileText, Loader2 } from 'lucide-react'
import { apiClient } from '@/shared/api/api-client'
import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog'
import { PDFViewer } from '@/features/view-pdf'
import { endpointKey } from '@/shared/lib/query/endpoint-key'

/** The PDF's address in whichever shape the answer carries it */
export const previewPdfAddress = (body: unknown): string | null => {
  if (typeof body === 'string') return body || null
  if (!body || typeof body !== 'object') return null

  const record = body as Record<string, unknown>
  for (const key of ['data', 'filePath', 'url', 'documentUrl']) {
    const value = record[key]
    if (typeof value === 'string' && value) return value
    if (value && typeof value === 'object') {
      const nested = previewPdfAddress(value)
      if (nested) return nested
    }
  }

  return null
}

/**
 * The passport as its PDF will read, built from the data as it stands - for
 * every role, so the preparer and its representatives can check it before the
 * customer approves it, not only whoever signs. Nothing is signed or saved.
 */
export const PdfPreviewButton = ({ passportId }: { passportId: string }) => {
  const [open, setOpen] = useState(false)

  const { data: url, isFetching } = useQuery({
    queryKey: endpointKey('/cadastre-passports', passportId, 'preview-pdf'),
    queryFn: async () => {
      const response = await apiClient.get<unknown>(`/cadastre-passports/${passportId}/preview-pdf`)
      const address = previewPdfAddress(response.data)

      if (!response.success || !address) throw new Error(response.message || 'PDF yaratishda xatolik!')

      return address
    },
    enabled: open,
    // Each opening builds it anew: the data may have changed since
    staleTime: 0,
    retry: false,
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileText className="mr-2 size-4" />
          PDF ko‘rinishi
        </Button>
      </DialogTrigger>
      <DialogContent className="flex h-[90vh] !w-[900px] !max-w-[95vw] flex-col gap-0 p-0">
        <DialogHeader className="border-b p-6 pb-4">
          <DialogTitle>TXYZ kadastr pasporti</DialogTitle>
          <DialogDescription>Hozirgi ma’lumotlar asosida shakllantirilgan, imzolanmagan nusxa</DialogDescription>
        </DialogHeader>
        <div className="relative min-h-0 flex-1 bg-gray-50">
          {isFetching ? (
            <div className="flex h-full items-center justify-center gap-2 text-sm text-gray-500">
              <Loader2 className="size-5 animate-spin" />
              PDF shakllantirilmoqda...
            </div>
          ) : url ? (
            <PDFViewer documentUrl={url} className="h-full" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-500">
              PDF’ni shakllantirib bo‘lmadi
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
