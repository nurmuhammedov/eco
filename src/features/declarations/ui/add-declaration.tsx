import { useAuth } from '@/shared/hooks/use-auth'
import useData from '@/shared/hooks/api/useData'
import { AccreditationStatus } from '@/entities/declarations/model/declaration.types'
import { UserRoles } from '@/entities/user'
import { ExpertDeclarationForm } from './expert-declaration-form'
import { LegalDeclarationForm } from './legal-declaration-form'
import { Loader } from '@/shared/components/common'

export const AddDeclaration = () => {
  const { user } = useAuth()
  const { data: accreditationStatus, isLoading } = useData<AccreditationStatus>(
    '/accreditations/status',
    user?.role === UserRoles.LEGAL
  )

  if (isLoading) return <Loader isVisible />

  const isExpert =
    accreditationStatus === AccreditationStatus.ACTIVE || accreditationStatus === AccreditationStatus.EXPIRING_SOON
  const isLegal = accreditationStatus === AccreditationStatus.NOT_PERMITTED

  return isExpert ? <ExpertDeclarationForm /> : isLegal ? <LegalDeclarationForm /> : null
}
