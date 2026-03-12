import { useParams } from 'react-router-dom'
import { useDetail } from '@/shared/hooks'
import { LegalDeclarationForm } from './legal-declaration-form'
import { ExpertDeclarationForm } from './expert-declaration-form'
import { Loader } from '@/shared/components/common'
import { useAuth } from '@/shared/hooks/use-auth.ts'
import useData from '../../../shared/hooks/api/useData.ts'
import { AccreditationStatus } from '@/entities/declarations/model/declaration.types.ts'
import { UserRoles } from '@/entities/user'

export const EditDeclaration = () => {
  const { id } = useParams()
  const { detail: declaration, isFetching } = useDetail<any>('/declarations', id, !!id)

  const { user } = useAuth()
  const { data: accreditationStatus, isLoading } = useData<AccreditationStatus>(
    '/accreditations/status',
    user?.role === UserRoles.LEGAL
  )

  if (isLoading || isFetching) return <Loader isVisible />

  const isExpert =
    accreditationStatus === AccreditationStatus.ACTIVE || accreditationStatus === AccreditationStatus.EXPIRING_SOON

  return (
    <div className="space-y-4">
      {!isExpert ? (
        <LegalDeclarationForm initialData={declaration} isEdit />
      ) : (
        <ExpertDeclarationForm initialData={declaration} isEdit />
      )}
    </div>
  )
}
