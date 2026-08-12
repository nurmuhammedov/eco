import { memo } from 'react'
import { PlusCircle } from 'lucide-react'
import { useEquipment } from '../model/use-equipment'
import { Button } from '@/shared/components/ui/button'
import { EquipmentDrawer, EquipmentList } from '@/features/admin/equipment'

const EquipmentWidget = () => {
  const { isOpenEquipment, onAddEquipment } = useEquipment()

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden">
      <div className="flex justify-end">
        <Button onClick={onAddEquipment}>
          <PlusCircle /> Quyi tur qo‘shish
        </Button>
      </div>
      <EquipmentList />
      {isOpenEquipment && <EquipmentDrawer />}
    </div>
  )
}
export default memo(EquipmentWidget)
