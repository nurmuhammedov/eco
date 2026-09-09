import { useEffect, useState } from 'react'
import { BrandLogo } from '@/shared/components/common'

const MONTHS = [
  'yanvar',
  'fevral',
  'mart',
  'aprel',
  'may',
  'iyun',
  'iyul',
  'avgust',
  'sentabr',
  'oktabr',
  'noyabr',
  'dekabr',
]

const WEEKDAYS = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba']

const pad = (value: number) => String(value).padStart(2, '0')

interface KioskHeaderProps {
  subtitle: string
  regionName: string | null
}

export const KioskHeader = ({ subtitle, regionName }: KioskHeaderProps) => {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)

    return () => clearInterval(id)
  }, [])

  return (
    <header className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-3 lg:px-8 lg:py-4">
      <div className="flex min-w-0 items-center gap-3 lg:gap-4">
        <BrandLogo className="size-9 shrink-0 lg:size-11" />
        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold tracking-tight text-slate-800 lg:text-lg">
            Sanoat, radiatsiya va yadro xavfsizligi qo‘mitasi ekotizimi
          </h1>
          <p className="mt-0.5 truncate text-[11px] text-slate-500 lg:text-sm">
            {subtitle}
            {regionName && <span className="text-slate-400"> · {regionName}</span>}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end">
        <span className="text-xl leading-none font-light tracking-tight text-slate-800 tabular-nums lg:text-3xl">
          {pad(now.getHours())}:{pad(now.getMinutes())}
          <span className="text-slate-400">:{pad(now.getSeconds())}</span>
        </span>
        <span className="mt-1 text-[10px] text-slate-500 lg:text-xs">
          {now.getDate()}-{MONTHS[now.getMonth()]} {now.getFullYear()}, {WEEKDAYS[now.getDay()]}
        </span>
      </div>
    </header>
  )
}
