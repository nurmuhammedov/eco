import { ApplicationTypeEnum } from '@/entities/create-application'
import { CreateApplicationForm } from '@/features/application/create-application'
import { canUpdateRegistryType } from '@/features/register/model/can-update-registry'
import { GoBack } from '@/shared/components/common'
import { useAuth } from '@/shared/hooks/use-auth'
import { useParams } from 'react-router-dom'

const RegisterUpdatePage = () => {
  const { type } = useParams<{ type: string; id: string }>()
  const { user } = useAuth()

  if (!type) {
    return <GoBack title="Reyestr turi ko‘rsatilmagan!" />
  }

  // The row action is hidden for these, but the address bar is not.
  if (!canUpdateRegistryType(type, user?.role)) {
    return <GoBack title="Ushbu turdagi reyestr ma’lumotlarini tahrirlash huquqi yo‘q" />
  }

  const mappedType = `ILLEGAL_REGISTER_${type.toUpperCase()}` as ApplicationTypeEnum

  return <CreateApplicationForm type={mappedType} isUpdate />
}

export default RegisterUpdatePage
