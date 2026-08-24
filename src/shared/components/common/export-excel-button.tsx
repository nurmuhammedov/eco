import { useState } from 'react'
import { format } from 'date-fns'
import { Download } from 'lucide-react'
import { toast } from 'sonner'
import { apiClient } from '@/shared/api/api-client'
import { Button } from '@/shared/components/ui/button'
import { saveBlob } from '@/shared/lib/save-blob'
import { cn } from '@/shared/lib/utils'

interface ExportExcelButtonProps {
  /** Export endpoint, e.g. `/permits/export/excel` */
  endpoint: string
  /** Saved as `<fileName> (dd.MM.yyyy).xlsx`, so exports of different days stay apart */
  fileName: string
  params?: Record<string, string | number | boolean | null | undefined | object>
  disabled?: boolean
  className?: string
}

/**
 * An export can take a while on a wide filter, so the request has to be visible
 * while it runs. Owning the pending state here also stops the button being
 * pressed twice, which would download the same file twice.
 */
export const ExportExcelButton = ({
  endpoint,
  fileName,
  params,
  disabled = false,
  className,
}: ExportExcelButtonProps) => {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)

    try {
      const response = await apiClient.downloadFile<Blob>(endpoint, params)
      saveBlob(response.data, `${fileName} (${format(new Date(), 'dd.MM.yyyy')}).xlsx`)
    } catch (error: any) {
      toast.error(error?.message || 'Faylni yuklab olishda xatolik', { richColors: true })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    // `loading` already supplies the spinner, aria-busy and the disabled state.
    <Button
      type="button"
      variant="successOutline"
      loading={isExporting}
      disabled={disabled}
      onClick={handleExport}
      className={cn('w-full sm:w-auto', className)}
    >
      {!isExporting && <Download className="size-4" aria-hidden="true" />}
      {isExporting ? 'Yuklanmoqda…' : 'Excelga yuklash'}
    </Button>
  )
}
