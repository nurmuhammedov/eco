import { OldConclusionDetail } from '@/features/expertise/ui/old-conclusion-detail'
import { GoBack } from '@/shared/components/common'

const OldConclusionDetailPage = () => {
  return (
    <div className="flex h-full flex-col gap-0">
      <GoBack title="Eski sanoat xavfsizligi deklaratsiyasi" />
      <OldConclusionDetail />
    </div>
  )
}

export default OldConclusionDetailPage
