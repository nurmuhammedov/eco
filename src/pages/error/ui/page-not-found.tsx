import { useTranslation } from 'react-i18next'
import Icon from '@/shared/components/common/icon'

export default function NotFound() {
  const { t } = useTranslation(['common'])
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <Icon name="page-not-found" className="size-80" />
      <h2 className="text-2xl font-semibold">{t('errors.page_not_found')}</h2>
    </div>
  )
}
