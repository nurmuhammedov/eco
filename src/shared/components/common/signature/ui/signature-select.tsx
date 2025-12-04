import { ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import { SignatureKey } from '@/shared/types/signature'

interface SignatureSelectProps {
  className?: string
  certificates?: SignatureKey[]
  onSelect?: (certificate: SignatureKey) => void
}

export function SignatureSelect({ onSelect, certificates = [], className = '' }: SignatureSelectProps) {
  const [open, setOpen] = useState(false)
  const [selectedCert, setSelectedCert] = useState<SignatureKey | null>()
  const dropdownRef = useRef<HTMLDivElement>(null)

  function handleSelectCertificate(cert: SignatureKey) {
    setSelectedCert(cert)
    setOpen(false)
    onSelect?.(cert)
  }

  // Close dropdown when clicking outside
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

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <Button
        variant="outline"
        onClick={() => setOpen(!open)}
        className={`h-auto w-full justify-between bg-white p-3 font-normal ${className}`}
      >
        <span className="truncate text-base text-gray-700">{selectedCert ? selectedCert.CN : 'ERI ni tanlang'}</span>
        <ChevronDown className="ml-2 size-4 shrink-0 opacity-50" />
      </Button>

      {open && (
        <div className="absolute top-full left-0 z-50 mt-1 max-h-80 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-md">
          {certificates.length === 0 ? (
            <div className="p-4 text-center text-gray-500">Sertifikatlar topilmadi</div>
          ) : (
            <div className="divide-y divide-gray-200">
              {certificates.map((cert, index) => (
                <div
                  key={cert.serialNumber || index}
                  onClick={() => handleSelectCertificate(cert)}
                  className="cursor-pointer p-4 hover:bg-gray-50"
                >
                  <div className="mb-2">
                    <div className="font-medium text-blue-800">{cert.CN}</div>
                    <span className="inline-block rounded-md bg-green-100 px-2 py-1 text-xs text-green-800">
                      {cert.O !== '' && cert.TIN !== '' ? 'Yuridik shaxs' : 'Jismoniy shaxs'}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Sertifikat raqami:</div>
                      <div className="font-semibold">{cert.serialNumber}</div>
                    </div>
                    <div>
                      <div className="text-right text-gray-500">Amal qilish muddati:</div>
                      <div className="text-right font-semibold">
                        {new Date(cert.validFrom).toLocaleDateString()} - {new Date(cert.validTo).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
