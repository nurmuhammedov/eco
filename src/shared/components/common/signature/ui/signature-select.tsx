import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { SignatureKey } from '@/shared/types/signature';

interface SignatureSelectProps {
  className?: string;
  certificates?: SignatureKey[];
  onSelect?: (certificate: SignatureKey) => void;
}

export function SignatureSelect({ onSelect, certificates = [], className = '' }: SignatureSelectProps) {
  const [open, setOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<SignatureKey | null>();
  const dropdownRef = useRef<HTMLDivElement>(null);

  function handleSelectCertificate(cert: SignatureKey) {
    setSelectedCert(cert);
    setOpen(false);
    onSelect?.(cert);
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <Button
        variant="outline"
        onClick={() => setOpen(!open)}
        className={`w-full justify-between font-normal p-3 h-auto bg-white ${className}`}
      >
        <span className="text-gray-700 text-base truncate">{selectedCert ? selectedCert.CN : 'ERI ni tanlang'}</span>
        <ChevronDown className="ml-2 size-4 shrink-0 opacity-50" />
      </Button>

      {open && (
        <div className="absolute z-50 left-0 top-full mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md max-h-80 overflow-auto">
          {certificates.length === 0 ? (
            <div className="p-4 text-center text-gray-500">Sertifikatlar topilmadi</div>
          ) : (
            <div className="divide-y divide-gray-200">
              {certificates.map((cert, index) => (
                <div
                  key={cert.serialNumber || index}
                  onClick={() => handleSelectCertificate(cert)}
                  className="p-4 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="mb-2">
                    <div className="font-medium text-blue-800">{cert.CN}</div>
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-md">
                      {cert.O !== '' && cert.TIN !== '' ? 'Yuridik shaxs' : 'Jismoniy shaxs'}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Sertifikat raqami:</div>
                      <div className="font-semibold">{cert.serialNumber}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-right">Amal qilish muddati:</div>
                      <div className="font-semibold text-right">
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
  );
}
