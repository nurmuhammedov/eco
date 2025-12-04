import { Fragment, memo } from 'react'
import { PlusCircle } from 'lucide-react'
import { useEquipment } from '../model/use-equipment'
import { Button } from '@/shared/components/ui/button'
import { EquipmentDrawer, EquipmentList } from '@/features/admin/equipment'

const EquipmentWidget = () => {
  const { isOpenEquipment, onAddEquipment } = useEquipment()

  return (
    <Fragment>
      <div className="mb-3 flex items-center justify-between">
        <h5 className="text-xl font-semibold uppercase">Qurilmalarning quyi turlari </h5>
        <Button onClick={onAddEquipment}>
          <PlusCircle /> Quyi tur qo'shish
        </Button>
      </div>
      <EquipmentList />
      {isOpenEquipment && <EquipmentDrawer />}
    </Fragment>
  )
}
export default memo(EquipmentWidget)
