import { ApplicationTypeEnum } from '@/entities/create-application'
import { CreateApplicationForm } from '@/features/application/create-application'
import { GoBack } from '@/shared/components/common'
import { useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

const RegisterUpdatePage = () => {
  const { type, id } = useParams<{ type: string; id: string }>()
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    if (id && searchParams.get('id') !== id) {
      searchParams.set('id', id)
      setSearchParams(searchParams, { replace: true })
    }
  }, [id, searchParams, setSearchParams])

  if (!type) {
    return <GoBack title="Tahlil turi ko‘rsatilmagan!" />
  }

  const mappedType = `ILLEGAL_REGISTER_${type.toUpperCase()}` as ApplicationTypeEnum

  return <CreateApplicationForm type={mappedType} />
}

export default RegisterUpdatePage
