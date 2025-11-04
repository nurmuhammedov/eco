import { Fragment } from 'react';
import { ActionButton } from './action-button';
import { useTranslation } from 'react-i18next';
// import { CategoryTypeDrawer, CategoryTypeList } from '@/features/admin/inspection/category-types';
// import { ChecklistDrawer, ChecklistList } from '@/features/admin/inspection/cheklists';
import { useInspectionManagement } from '../model/use-inspection-management';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { CategoryTypeList } from '@/features/admin/inspection/category-types/ui/category-type-list';
import { ChecklistList } from '@/features/admin/inspection/cheklists/ui/checklist-list';
import { CategoryTypeDrawer } from '@/features/admin/inspection/category-types/ui/category-type-drawer';
import { ChecklistDrawer } from '@/features/admin/inspection/cheklists/ui/checklist-drawer';

const InspectionManagement = () => {
  const { t } = useTranslation('common');
  const {
    activeTab,
    isOpenCategoryType,
    isOpenChecklist,
    handleChangeTab,
    openAddCategoryTypeDrawer,
    openAddChecklistDrawer,
  } = useInspectionManagement();

  return (
    <Fragment>
      <ActionButton
        activeTab={activeTab}
        title={t('menu.inspection')}
        onAddCategoryType={openAddCategoryTypeDrawer}
        onAddChecklist={openAddChecklistDrawer}
      />

      <Tabs className="mt-3" defaultValue={activeTab} onValueChange={(value: any) => handleChangeTab(value)}>
        <TabsList>
          <TabsTrigger value="checklists">{t('checklists')}</TabsTrigger>
          <TabsTrigger value="categoryType">{t('categoryTypes')}</TabsTrigger>
        </TabsList>

        <TabsContent className="mt-4" value="categoryType">
          <CategoryTypeList />
        </TabsContent>

        <TabsContent className="mt-4" value="checklists">
          <ChecklistList />
        </TabsContent>
      </Tabs>

      {isOpenCategoryType && <CategoryTypeDrawer />}
      {isOpenChecklist && <ChecklistDrawer />}
    </Fragment>
  );
};

export default InspectionManagement;
