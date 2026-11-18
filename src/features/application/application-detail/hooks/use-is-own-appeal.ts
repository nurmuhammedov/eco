import { useAuth } from '@/shared/hooks/use-auth'
import { isOwnAppeal } from '../model/appeal-permissions'
import { useApplicationDetail } from './use-application-detail'

/** Whether the signed-in user may act on the open appeal, not merely read it */
export const useIsOwnAppeal = () => {
  const { user } = useAuth()
  const { data: appeal } = useApplicationDetail()

  return isOwnAppeal(user, appeal)
}
