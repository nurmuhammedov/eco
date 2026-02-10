import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/shared/hooks/use-auth'
import { routeByRole } from '@/shared/lib/router/route-by-role'
import { Button } from '@/shared/components/ui/button'
import { useTranslation } from 'react-i18next'
import Icon from '@/shared/components/common/icon'

export default function NotFound() {
  const { t } = useTranslation(['common'])
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-slate-50 py-6 sm:py-12">
      <div className="w-full max-w-lg px-4">
        <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-14">
          <div className="mb-6 flex items-center justify-center sm:mb-8">
            <div className="relative flex items-center justify-center rounded-full bg-slate-50 p-4 ring-1 ring-slate-100 sm:p-6">
              <Icon name="page-not-found" className="h-16 w-16 text-slate-400 opacity-80 sm:h-24 sm:w-24" />
            </div>
          </div>
          <h2 className="mb-3 text-center text-xl font-semibold text-slate-700 sm:mb-4 sm:text-2xl">
            {t('errors.page_not_found')}
          </h2>
          <p className="mb-6 text-center text-sm leading-relaxed text-slate-500 sm:mb-8 sm:text-base">
            Uzr, siz qidirayotgan sahifa mavjud emas yoki o‘zgartirilgan bo‘lishi mumkin. Iltimos, manzilni tekshiring
            yoki bosh sahifaga qayting.
          </p>

          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="w-full flex-1 bg-slate-900 font-medium text-white hover:bg-slate-800"
              onClick={() => navigate(routeByRole(user?.role))}
            >
              Bosh sahifa
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full flex-1 border-slate-200 font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
              onClick={() => navigate(-1)}
            >
              Orqaga qaytish
            </Button>
          </div>
          <div className="mt-8 border-t border-slate-100 pt-6 text-center text-xs text-slate-400 sm:mt-10 sm:text-sm">
            &copy; {new Date().getFullYear()} Sanoat xavfsizligi ekotizimi
          </div>
        </div>
      </div>
    </div>
  )
}
