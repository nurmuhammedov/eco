import { AddConclusion } from '@/features/expertise/ui/add-conclusion'
import { GoBack } from '@/shared/components/common'

const AddConclusionPage = () => {
  return (
    <div>
      <GoBack title="Ekspertiza xulosasini qo‘shish" />
      <AddConclusion />
    </div>
  )
}

export default AddConclusionPage
