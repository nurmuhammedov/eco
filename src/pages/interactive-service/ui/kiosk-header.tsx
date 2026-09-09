import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2, LogOut } from 'lucide-react'
import { useLogout } from '@/entities/auth/models/auth.fetcher'
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
}

export const KioskHeader = ({ subtitle }: KioskHeaderProps) => {
  const [now, setNow] = useState(() => new Date())
  const [showExit, setShowExit] = useState(false)
  const { t } = useTranslation('auth')
  const { mutate: logout, isPending } = useLogout()

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)

    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (!showExit) return

    const id = setTimeout(() => setShowExit(false), 8000)

    return () => clearTimeout(id)
  }, [showExit])

  return (
    <header className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-3 lg:px-8 lg:py-4">
      <div className="flex min-w-0 items-center gap-3 lg:gap-4">
        <BrandLogo className="size-9 shrink-0 lg:size-11" />
        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold tracking-tight text-slate-800 lg:text-lg">
            Sanoat, radiatsiya va yadro xavfsizligi qo‘mitasi ekotizimi
          </h1>
          <p className="mt-0.5 truncate text-[11px] text-slate-500 lg:text-sm">{subtitle}</p>
        </div>
      </div>

      <div className="relative flex shrink-0 flex-col items-end">
        {/* Nothing on a wall display should invite a click, so the way out is
            behind the clock and steps back out of sight on its own. */}
        <button
          type="button"
          onClick={() => setShowExit((current) => !current)}
          aria-expanded={showExit}
          className="cursor-pointer text-right"
        >
          <span className="block text-xl leading-none font-light tracking-tight text-slate-800 tabular-nums lg:text-3xl">
            {pad(now.getHours())}:{pad(now.getMinutes())}
            <span className="text-slate-400">:{pad(now.getSeconds())}</span>
          </span>
          <span className="mt-1 block text-[10px] text-slate-500 lg:text-xs">
            {now.getDate()}-{MONTHS[now.getMonth()]} {now.getFullYear()}, {WEEKDAYS[now.getDay()]}
          </span>
        </button>

        {showExit && (
          <button
            type="button"
            onClick={() => logout()}
            disabled={isPending}
            className="text-destructive absolute top-full right-0 z-20 mt-2 flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs shadow-lg transition-colors hover:bg-red-50 disabled:cursor-default disabled:opacity-60"
          >
            {isPending ? <Loader2 className="size-3.5 animate-spin" /> : <LogOut className="size-3.5" />}
            {t('logout')}
          </button>
        )}
      </div>
    </header>
  )
}
