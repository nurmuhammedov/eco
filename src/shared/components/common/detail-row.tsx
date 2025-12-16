import React, { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils' // clsx yoki classnames o'rniga

interface DetailRowProps {
  title: string
  value: ReactNode | string | null
  boldTitle?: boolean
  className?: string
}

const DetailRow: React.FC<DetailRowProps> = ({ title, value, boldTitle = false, className }) => {
  // Agar value bo'sh bo'lsa, komponent chizilmaydi
  if (value === null || value === undefined || value === '') {
    return null
  }

  return (
    <div
      className={cn(
        // O'zgarishlar:
        // py-1.5 -> py-1: Balandlikni kamaytiradi
        // rounded-lg -> rounded-md: Burchaklarni moslashtirish
        // gap-2: Label va Value orasini biroz ochish
        'grid grid-cols-2 items-center gap-4 rounded-md px-2 py-1 odd:bg-neutral-50',
        className
      )}
    >
      <span
        className={cn(
          'text-sm',
          // Label rangi biroz ochroq (gray-500) bo'lsa, ma'lumot (value) yaqqolroq ko'rinadi
          boldTitle ? 'font-semibold text-gray-800' : 'font-medium text-gray-500'
        )}
      >
        {title}
      </span>

      <div className="text-sm font-medium break-words text-gray-900">{value}</div>
    </div>
  )
}

export default DetailRow
