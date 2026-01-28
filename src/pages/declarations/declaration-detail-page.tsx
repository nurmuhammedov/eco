import { DeclarationDetail } from '@/features/declarations/ui/declaration-detail'
import { GoBack } from '@/shared/components/common'

const DeclarationDetailPage = () => {
  return (
    <div>
      <GoBack title="Deklaratsiya tafsilotlari" />
      <DeclarationDetail />
    </div>
  )
}

export default DeclarationDetailPage
