import { AccreditationList } from '@/features/accreditation/ui/accreditation-list';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { useCustomSearchParams } from '@/shared/hooks';
import { AccreditationConclusionList } from '@/features/accreditation/ui/accreditation-conclusion-list';

export const AccreditationWidget = () => {
  const { t } = useTranslation('common');

  const {
    paramsObject: { activeTab = 'pending' },
    addParams,
  } = useCustomSearchParams();

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">{t('menu.accreditation')}</h2>

      <Tabs value={activeTab} onValueChange={(activeTab) => addParams({ activeTab })}>
        <TabsList className="mb-2">
          <TabsTrigger value="pending">{t('menu.accreditation')}</TabsTrigger>
          <TabsTrigger value="passed">Xulosalar</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          <AccreditationList />
        </TabsContent>
        <TabsContent value="passed">
          <AccreditationConclusionList />
        </TabsContent>
      </Tabs>
    </>
  );
};
