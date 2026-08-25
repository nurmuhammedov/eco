import { useMemo } from 'react'
import { AlertCircle, KeyRound } from 'lucide-react'
import { format } from 'date-fns'
import { SignatureKey } from '@/shared/types/signature'
import { cn } from '@/shared/lib/utils'
import { useAuth } from '@/shared/hooks/use-auth.ts'
import { UserRoles } from '@/entities/user'

interface SignatureSelectProps {
  className?: string
  certificates?: SignatureKey[]
  value?: SignatureKey | null
  onSelect?: (certificate: SignatureKey) => void
  disabled?: boolean
}

const isExpired = (validTo: string | Date) => new Date(validTo) < new Date()

const Field = ({ label, value, align = 'left' }: { label: string; value: string; align?: 'left' | 'right' }) => (
  <div className={cn('min-w-0', align === 'right' && 'text-right')}>
    <div className="text-[11px] tracking-wide text-neutral-500 uppercase">{label}</div>
    <div className="mt-0.5 truncate text-sm font-medium text-neutral-800">{value}</div>
  </div>
)

/**
 * The list is inline rather than a dropdown. An absolutely positioned menu
 * inside a scrolling modal body is clipped by it, which left the options
 * unreachable behind a scrollbar. Native radios also give arrow-key movement
 * and a real selected state for free.
 */
export function SignatureSelect({
  onSelect,
  certificates = [],
  value = null,
  className = '',
  disabled = false,
}: SignatureSelectProps) {
  const { user } = useAuth()

  const sorted = useMemo(
    () =>
      [...certificates]
        .filter((item) =>
          user?.role !== UserRoles.LEGAL
            ? Number(item?.PINFL) === Number(user?.tinOrPin)
            : Number(item?.TIN) === Number(user?.tinOrPin)
        )
        .sort((a, b) => {
          if (isExpired(a.validTo) !== isExpired(b.validTo)) return isExpired(a.validTo) ? 1 : -1

          return (a.CN || '').localeCompare(b.CN || '')
        }),
    [certificates, user?.role, user?.tinOrPin]
  )

  if (sorted.length === 0) {
    return (
      <div
        className={cn(
          'flex flex-col items-center gap-2 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-8 text-center',
          className
        )}
      >
        <KeyRound className="size-6 text-neutral-400" />
        <p className="text-sm font-medium text-neutral-700">Sertifikatlar topilmadi</p>
        <p className="max-w-sm text-xs text-neutral-500">
          E-IMZO dasturi ishga tushirilganini va kalitingiz ulanganini tekshiring. Ro‘yxatda faqat sizning STIR yoki
          JSHSHIR raqamingizga tegishli kalitlar ko‘rinadi.
        </p>
      </div>
    )
  }

  return (
    <div role="radiogroup" aria-label="Elektron raqamli imzo kaliti" className={cn('space-y-2', className)}>
      {sorted.map((cert, index) => {
        const expired = isExpired(cert.validTo)
        const isLegal = !!(cert.O && cert.TIN)
        const id = cert.serialNumber || String(index)

        return (
          <label
            key={id}
            // The visible text sits several elements deep, so the radio is named
            // here rather than left to the label's contents.
            aria-label={`${isLegal ? cert.O : cert.CN}, ${cert.serialNumber}${expired ? ', muddati o‘tgan' : ''}`}
            className={cn(
              'flex gap-3 rounded-xl border p-3 transition-colors',
              expired
                ? 'cursor-not-allowed border-neutral-200 bg-neutral-50 opacity-70'
                : 'has-checked:border-primary has-checked:bg-primary/5 cursor-pointer border-neutral-200 hover:bg-neutral-50',
              disabled && 'pointer-events-none opacity-50'
            )}
          >
            <input
              type="radio"
              name="signature-certificate"
              className="accent-primary mt-1 size-4 shrink-0"
              value={id}
              checked={value?.serialNumber === cert.serialNumber}
              disabled={disabled || expired}
              onChange={() => onSelect?.(cert)}
            />

            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-start justify-between gap-2">
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-neutral-900">
                    {isLegal ? cert.O : cert.CN}
                  </span>
                  {isLegal && <span className="mt-0.5 block truncate text-xs text-neutral-600">Rahbar: {cert.CN}</span>}
                </span>

                {expired ? (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                    <AlertCircle className="size-3" />
                    Muddati o‘tgan
                  </span>
                ) : (
                  <span className="shrink-0 rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600">
                    {isLegal ? 'Yuridik shaxs' : 'Jismoniy shaxs'}
                  </span>
                )}
              </span>

              <span className="mt-2.5 grid grid-cols-2 gap-3">
                <Field label="Sertifikat raqami" value={cert.serialNumber} />
                <Field
                  label="Amal qilish muddati"
                  align="right"
                  value={`${format(new Date(cert.validFrom), 'dd.MM.yyyy')} - ${format(new Date(cert.validTo), 'dd.MM.yyyy')}`}
                />
              </span>
            </span>
          </label>
        )
      })}
    </div>
  )
}
