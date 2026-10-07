import useData from '@/shared/hooks/api/use-data'
import { useAuth } from '@/shared/hooks/use-auth'
import { UserRoles } from '@/shared/types/user'

/** The organisation an employee prepares passports for, as the admin attached them to it */
export interface CadastreRepresentation {
  name: string
  tin: number
}

/**
 * A person signed in through OneID may stand for one organisation and prepare passports
 * in its name; reviewers (FVV/SES staff) and everyone else get null.
 */
export const useCadastreRepresentation = () => {
  const { user } = useAuth()
  const isIndividual = user?.role === UserRoles.INDIVIDUAL

  const { data, isLoading } = useData<CadastreRepresentation | null>('/cadastre-passports/representation', isIndividual)

  return { representation: isIndividual ? (data ?? null) : null, isLoading: isIndividual && isLoading }
}
