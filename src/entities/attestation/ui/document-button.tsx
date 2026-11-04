import { useState, type ReactNode } from 'react'
import { FileText, Loader2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import type { RequestParams } from '@/shared/api/create-api-client'
import { openAttestationDocument } from '../lib/open-document'

interface Props {
  url: string
  fileName: string
  params?: RequestParams
  /** Shown as text, or as the tooltip when the button is an icon */
  label: string
  icon?: ReactNode
  iconOnly?: boolean
}

/** Opens one of the PDF documents of the attestation in a new tab */
export const DocumentButton = ({ url, fileName, params, label, icon, iconOnly = false }: Props) => {
  const [isLoading, setIsLoading] = useState(false)

  const open = () => {
    setIsLoading(true)
    void openAttestationDocument(url, fileName, params).finally(() => setIsLoading(false))
  }

  const glyph = isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (icon ?? <FileText className="h-4 w-4" />)

  if (iconOnly) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-blue-500"
        title={label}
        aria-label={label}
        disabled={isLoading}
        onClick={open}
      >
        {glyph}
      </Button>
    )
  }

  return (
    <Button type="button" variant="outline" size="sm" disabled={isLoading} onClick={open}>
      <span className="mr-1.5">{glyph}</span>
      {label}
    </Button>
  )
}
