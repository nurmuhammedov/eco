import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import { ParksDrawer, ParksList } from '@/features/admin/parks'
import { useParkDrawer } from '@/shared/hooks/entity-hooks'
import { UIModeEnum } from '@/shared/types/ui-types'
import { Button } from '@/shared/components/ui/button'

const ParksPage = () => {
  const { t } = useTranslation('common')
  const { onOpen } = useParkDrawer()

  const onCreate = () => onOpen(UIModeEnum.CREATE)

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden">
      <div className="flex justify-end">
        <Button onClick={onCreate}>
          <Plus className="mr-2 h-4 w-4" /> {t('add')}
        </Button>
      </div>
      <ParksList />
      <ParksDrawer />
    </div>
  )
}

export default ParksPage
