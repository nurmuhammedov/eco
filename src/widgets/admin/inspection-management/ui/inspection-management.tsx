import { CategoryTypeList } from '@/features/admin/inspection/category-types/ui/category-type-list'
import { CategoryTypeDrawer } from '@/features/admin/inspection/category-types/ui/category-type-drawer'
import { PlusCircle } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { useTranslation } from 'react-i18next'
import { useInspectionManagement } from '../model/use-inspection-management'

import { ChecklistDrawer } from '@/features/admin/inspection/cheklists/ui/checklist-drawer'

const InspectionManagement = () => {
  const { t } = useTranslation('common')
  const { isOpenCategoryType, isOpenChecklist, openAddCategoryTypeDrawer } = useInspectionManagement()

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden">
      <div className="flex justify-end">
        <div className="flex gap-2">
          <Button onClick={openAddCategoryTypeDrawer}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {t('actions.add_category_type')}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <CategoryTypeList />
      </div>

      {isOpenCategoryType && <CategoryTypeDrawer />}
      {isOpenChecklist && <ChecklistDrawer />}
    </div>
  )
}

export default InspectionManagement
