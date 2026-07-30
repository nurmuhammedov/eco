import { Fragment } from 'react'
import { CategoryTypeList } from '@/features/admin/inspection/category-types/ui/category-type-list'
import { CategoryTypeDrawer } from '@/features/admin/inspection/category-types/ui/category-type-drawer'
import { PlusCircle } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { useTranslation } from 'react-i18next'
// import { ChecklistDrawer, ChecklistList } from '@/features/admin/inspection/cheklists';
import { useInspectionManagement } from '../model/use-inspection-management'

import { ChecklistDrawer } from '@/features/admin/inspection/cheklists/ui/checklist-drawer'

const InspectionManagement = () => {
  const { t } = useTranslation('common')
  const { isOpenCategoryType, isOpenChecklist, openAddCategoryTypeDrawer } = useInspectionManagement()

  return (
    <Fragment>
      <div className="mt-4 flex justify-between">
        <h5 className="text-2xl font-semibold uppercase">{t('menu.inspection')}</h5>
        <div className="flex gap-2">
          <Button onClick={openAddCategoryTypeDrawer}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {t('actions.add_category_type')}
          </Button>
        </div>
      </div>

      <div className="mt-4">
        <CategoryTypeList />
      </div>

      {isOpenCategoryType && <CategoryTypeDrawer />}
      {isOpenChecklist && <ChecklistDrawer />}
    </Fragment>
  )
}

export default InspectionManagement
