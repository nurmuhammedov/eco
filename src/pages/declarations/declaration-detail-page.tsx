import { useParams } from 'react-router-dom'
import { DeclarationDetail } from '@/features/declarations/ui/declaration-detail'
import { DeclarationActions } from '@/features/declarations/ui/declaration-actions'
import { GoBack } from '@/shared/components/common'
import { useAuth } from '@/shared/hooks/use-auth'
import { UserRoles } from '@/shared/types/user'
import useDetail from '@/shared/hooks/api/use-detail'
import type { DeclarationDetail as DeclarationDetailData } from '@/entities/declarations/model/declaration.types'

const DeclarationDetailPage = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const { detail } = useDetail<DeclarationDetailData>('/declarations', id, !!id)

  const isRegional = user?.role === UserRoles.REGIONAL

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <GoBack title="Deklaratsiya tafsilotlari" />
        <div className="flex gap-2">{isRegional && <DeclarationActions id={id!} status={detail?.status} />}</div>
      </div>
      <DeclarationDetail detailData={detail} />
    </div>
  )
}

export default DeclarationDetailPage
