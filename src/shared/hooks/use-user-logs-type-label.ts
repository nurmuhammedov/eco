import { useTranslation } from 'react-i18next'
import { UserLogsTypeEnum } from '@/entities/admin/user-logs'

export const useUserLogsTypeLabel = () => {
  const { t } = useTranslation()

  return (type: UserLogsTypeEnum | null | undefined, ty: string): string => {
    if (!type) return '-'
    return t(`user-logs.${ty}.${type}`)
  }
}
