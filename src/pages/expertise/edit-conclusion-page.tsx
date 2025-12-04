import { UpdateConclusion } from '@/features/expertise/ui/edit-conclusion'
import { GoBack } from '@/shared/components/common'

const EditConclusionPage = () => {
  return (
    <div>
      <GoBack title="Ekspertiza xulosasini yangilash" />
      <UpdateConclusion />
    </div>
  )
}

export default EditConclusionPage
