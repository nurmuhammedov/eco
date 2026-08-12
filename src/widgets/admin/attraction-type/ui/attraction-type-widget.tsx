import { AttractionTypeDrawer } from '@/features/admin/attraction-type/ui/attraction-type-drawer'
import { AttractionTypeList } from '@/features/admin/attraction-type/ui/attraction-type-list'
import { Button } from '@/shared/components/ui/button'
import { useAttractionTypeDrawer } from '@/shared/hooks/entity-hooks'
import { UIModeEnum } from '@/shared/types'
import { PlusCircle } from 'lucide-react'
import { memo } from 'react'

const AttractionTypeWidget = () => {
  const { isOpen, onOpen } = useAttractionTypeDrawer()

  const handleAdd = () => {
    onOpen(UIModeEnum.CREATE)
  }

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden">
      <div className="flex justify-end">
        <Button onClick={handleAdd}>
          <PlusCircle /> Attraksion tipi qo‘shish
        </Button>
      </div>
      <AttractionTypeList />
      {isOpen && <AttractionTypeDrawer />}
    </div>
  )
}
export default memo(AttractionTypeWidget)
