// src/widgets/admin/checklist-templates/ui/checklist-templates-widget.tsx
import { ChecklistTemplatesDrawer } from '@/features/admin/checklist-templates/ui/checklist-templates-drawer';
import { ChecklistTemplatesList } from '@/features/admin/checklist-templates/ui/checklist-templates-list';
import { Button } from '@/shared/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import useCustomSearchParams from '@/shared/hooks/api/useSearchParams';
import { useChecklistTemplateDrawer } from '@/shared/hooks/entity-hooks';
import { UIModeEnum } from '@/shared/types';
import { PlusCircle } from 'lucide-react';
import { Fragment, memo } from 'react';
import { useTranslation } from 'react-i18next';

const ChecklistTemplatesWidget = () => {
  const { t } = useTranslation('common');
  const { isOpen, onOpen } = useChecklistTemplateDrawer();
  const {
    paramsObject: { active = 'true' },
    addParams,
  } = useCustomSearchParams();

  const handleAdd = () => {
    onOpen(UIModeEnum.CREATE);
  };

  const handleTabChange = (value: string) => {
    addParams({ active: value });
  };

  return (
    <Fragment>
      <div className="flex items-center justify-between mb-3 mt-4">
        <h5 className="text-xl font-semibold uppercase">{t('menu.checklist_templates', 'Cheklistlar')}</h5>
        <Button onClick={handleAdd}>
          <PlusCircle /> {t('add_checklist', "Cheklist qo'shish")}
        </Button>
      </div>

      <Tabs value={active?.toString()} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-sm">
          <TabsTrigger value="true">{t('status.active', 'Aktiv')}</TabsTrigger>
          <TabsTrigger value="false">{t('status.inactive', 'Aktiv emas')}</TabsTrigger>
        </TabsList>
        <TabsContent value={active?.toString()}>
          <ChecklistTemplatesList />
        </TabsContent>
      </Tabs>

      {isOpen && <ChecklistTemplatesDrawer />}
    </Fragment>
  );
};

export default memo(ChecklistTemplatesWidget);
