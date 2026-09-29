import UpdateOrganization from '@/features/register/radiation-profile/ui/update-organization'
import { canUpdateRegistryType } from '@/features/register/model/can-update-registry'
import { GoBack } from '@/shared/components/common'
import { useAuth } from '@/shared/hooks/use-auth'
import { useParams } from 'react-router-dom'

export default function UpdateOrganizationPage() {
  const { type } = useParams<{ type: string }>()
  const { user } = useAuth()

  // The row action is hidden for these, but the address bar is not.
  if (!canUpdateRegistryType(type, user?.role)) {
    return <GoBack title="Ushbu turdagi reyestr ma’lumotlarini tahrirlash huquqi yo‘q" />
  }

  return <UpdateOrganization />
}
