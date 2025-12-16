import { AlertCircle, ChevronDown } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import { SignatureKey } from '@/shared/types/signature'
import { cn } from '@/shared/lib/utils'
import { format } from 'date-fns'

interface SignatureSelectProps {
  className?: string
  certificates?: SignatureKey[]
  onSelect?: (certificate: SignatureKey) => void
  disabled?: boolean
}

export function SignatureSelect({
  onSelect,
  certificates = [],
  className = '',
  disabled = false,
}: SignatureSelectProps) {
  const [open, setOpen] = useState(false)
  const [selectedCert, setSelectedCert] = useState<SignatureKey | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const isCertificateExpired = (validTo: string | Date): boolean => {
    return new Date(validTo) < new Date()
  }

  const sortedCertificates = useMemo(() => {
    return [...certificates].sort((a, b) => {
      const aExpired = isCertificateExpired(a.validTo)
      const bExpired = isCertificateExpired(b.validTo)

      if (aExpired !== bExpired) {
        return aExpired ? 1 : -1
      }
      return (a.CN || '').localeCompare(b.CN || '')
    })
  }, [certificates])

  function handleSelectCertificate(cert: SignatureKey) {
    if (isCertificateExpired(cert.validTo)) return

    setSelectedCert(cert)
    setOpen(false)
    onSelect?.(cert)
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  const renderSelectedContent = () => {
    if (!selectedCert) {
      return (
        <div className="flex w-full items-center justify-between">
          <span className="text-gray-700">ERI ni tanlang</span>
          <ChevronDown className="ml-2 size-4 opacity-50" />
        </div>
      )
    }

    return (
      <div className="w-full text-left">
        <div className="mb-2 flex items-start justify-between">
          <div>
            <div className="font-medium text-blue-800">{selectedCert.CN}</div>
            <span className="mt-1 inline-block rounded-md bg-green-100 px-2 py-1 text-xs text-green-800">
              {selectedCert.O && selectedCert.TIN ? 'Yuridik shaxs' : 'Jismoniy shaxs'}
            </span>
          </div>
          <ChevronDown className="ml-2 size-4 shrink-0 opacity-50" />
        </div>

        <div className="flex justify-between gap-4 text-sm">
          <div>
            <div className="text-gray-500">Sertifikat raqami:</div>
            <div className="font-semibold text-gray-700">{selectedCert.serialNumber}</div>
          </div>
          <div>
            <div className="text-right text-gray-500">Amal qilish muddati:</div>
            <div className="text-right font-semibold text-gray-700">
              {format(new Date(selectedCert.validFrom), 'dd.MM.yyyy')} -{' '}
              {format(new Date(selectedCert.validTo), 'dd.MM.yyyy')}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('relative w-full', className)} ref={dropdownRef}>
      <Button
        variant="outline"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className="h-auto w-full flex-col items-stretch bg-white p-3 font-normal disabled:cursor-not-allowed disabled:opacity-50"
      >
        {renderSelectedContent()}
      </Button>

      {open && !disabled && (
        <div className="absolute top-full left-0 z-50 mt-1 max-h-80 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-md">
          {sortedCertificates.length === 0 ? (
            <div className="p-4 text-center text-gray-500">Sertifikatlar topilmadi</div>
          ) : (
            <div className="divide-y divide-gray-200">
              {sortedCertificates.map((cert, index) => {
                const isExpired = isCertificateExpired(cert.validTo)

                return (
                  <div
                    key={cert.serialNumber || index}
                    onClick={() => handleSelectCertificate(cert)}
                    className={cn(
                      'relative p-4 transition-colors',
                      isExpired ? 'cursor-not-allowed bg-gray-50 opacity-60' : 'cursor-pointer hover:bg-gray-50'
                    )}
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <div className={cn('font-medium', isExpired ? 'text-gray-600' : 'text-blue-800')}>
                          {cert.CN}
                        </div>
                        <span className="mt-1 inline-block rounded-md bg-green-100 px-2 py-1 text-xs text-green-800">
                          {cert.O && cert.TIN ? 'Yuridik shaxs' : 'Jismoniy shaxs'}
                        </span>
                      </div>

                      {isExpired && (
                        <span className="flex items-center rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-600">
                          <AlertCircle className="mr-1 size-3" />
                          Muddati o‘tgan
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Sertifikat raqami:</div>
                        <div className="font-semibold text-gray-700">{cert.serialNumber}</div>
                      </div>
                      <div>
                        <div className="text-right text-gray-500">Amal qilish muddati:</div>
                        <div className={cn('text-right font-semibold', isExpired ? 'text-red-500' : 'text-gray-700')}>
                          {format(new Date(cert.validFrom), 'dd.MM.yyyy')} -{' '}
                          {format(new Date(cert.validTo), 'dd.MM.yyyy')}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
