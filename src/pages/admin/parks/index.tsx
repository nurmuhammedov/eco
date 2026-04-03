import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import { ParksDrawer, ParksList } from '@/features/admin/parks'
import GoBack from '@/shared/components/common/go-back'
import { useParkDrawer } from '@/shared/hooks/entity-hooks'
import { UIModeEnum } from '@/shared/types/ui-types'
import { Button } from '@/shared/components/ui/button'

const ParksPage = () => {
  const { t } = useTranslation('common')
  const { onOpen } = useParkDrawer()

  const onCreate = () => onOpen(UIModeEnum.CREATE)

  return (
    <>
      <div className="mb-2 flex items-center justify-between gap-4">
        <GoBack title={t('parks')} />

        <Button onClick={onCreate}>
          <Plus className="mr-2 h-4 w-4" /> {t('add')}
        </Button>
      </div>
      <ParksList />
      <ParksDrawer />
    </>
  )
}

export default ParksPage
