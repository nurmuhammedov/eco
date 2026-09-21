import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Home, SearchX } from 'lucide-react'
import { useAuth } from '@/shared/hooks/use-auth'
import { routeByRole } from '@/shared/lib/router/route-by-role'
import { Button } from '@/shared/components/ui/button'

export default function NotFound() {
  const { t } = useTranslation(['common'])
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { user } = useAuth()

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="relative mb-6 flex items-center justify-center">
        <span aria-hidden className="text-8xl leading-none font-bold text-neutral-200 select-none sm:text-9xl">
          404
        </span>
        <span className="bg-teal/10 absolute flex size-16 items-center justify-center rounded-full sm:size-20">
          <SearchX className="text-teal size-8 sm:size-10" />
        </span>
      </div>

      <h1 className="text-xl font-semibold text-neutral-900 sm:text-2xl">{t('errors.page_not_found')}</h1>

      <p className="mt-2 max-w-md text-sm text-neutral-500 sm:text-base">
        Bunday sahifa mavjud emas yoki manzili o‘zgargan. Manzilni tekshirib ko‘ring yoki bosh sahifaga qayting.
      </p>

      {/* The address is what the reader can actually check; without it a typo in
          a shared link is invisible. */}
      <code className="mt-4 max-w-full truncate rounded-md bg-neutral-100 px-3 py-1.5 text-xs text-neutral-500">
        {pathname}
      </code>

      <div className="mt-8 flex w-full max-w-sm flex-col gap-2 sm:w-auto sm:flex-row">
        <Button onClick={() => navigate(routeByRole(user?.role))}>
          <Home className="mr-2 size-4" />
          Bosh sahifa
        </Button>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 size-4" />
          Orqaga
        </Button>
      </div>
    </div>
  )
}
