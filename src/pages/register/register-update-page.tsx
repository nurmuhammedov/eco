import { ApplicationTypeEnum } from '@/entities/create-application'
import { CreateApplicationForm } from '@/features/application/create-application'
import { GoBack } from '@/shared/components/common'
import { useParams } from 'react-router-dom'

const RegisterUpdatePage = () => {
  const { type } = useParams<{ type: string; id: string }>()

  if (!type) {
    return <GoBack title="Reyestr turi ko‘rsatilmagan!" />
  }

  const mappedType = `ILLEGAL_REGISTER_${type.toUpperCase()}` as ApplicationTypeEnum

  return <CreateApplicationForm type={mappedType} isUpdate />
}

export default RegisterUpdatePage
