import { TFunction } from 'i18next'
import { Badge } from '../components/ui/badge'

export const getUserStatusDisplay = (status: boolean, t: TFunction) => {
  return status ? (
    <Badge className="bg-emerald-600/10 px-4 py-1.5 text-emerald-500 shadow-none">{t('active')}</Badge>
  ) : (
    <Badge className="bg-red-600/10 px-4 py-1.5 text-red-500 shadow-none">{t('inactive')}</Badge>
  )
}
