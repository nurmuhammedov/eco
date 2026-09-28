import { ConclusionDetail } from '@/features/expertise/ui/conclusion-detail'
import { GoBack } from '@/shared/components/common'

const OldConclusionDetailPage = () => {
  return (
    <div className="flex h-full flex-col gap-0">
      <GoBack title="Eski sanoat xavfsizligi deklaratsiyasi" />
      <ConclusionDetail isOld />
    </div>
  )
}

export default OldConclusionDetailPage
