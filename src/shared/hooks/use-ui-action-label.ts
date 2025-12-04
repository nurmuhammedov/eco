import { useMemo } from 'react'
import { UIModeEnum } from '@/shared/types'
import { useTranslation } from 'react-i18next'

export function useUIActionLabel(mode: UIModeEnum | undefined | null, i18nPath = 'actions'): string {
  const { t } = useTranslation('common')

  return useMemo(() => {
    if (!mode) return ''
    return i18nPath ? t(`${i18nPath}.${mode}`) : t(`actions.${mode}`)
  }, [t, mode, i18nPath])
}
