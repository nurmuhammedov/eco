import { AddOldConclusion } from '@/features/expertise/ui/add-old-conclusion'
import { GoBack } from '@/shared/components/common'

const AddOldConclusionPage = () => {
  return (
    <div>
      <GoBack title="Eski sanoat xavfsizligi deklaratsiyasini qo‘shish" />
      <AddOldConclusion />
    </div>
  )
}

export default AddOldConclusionPage
