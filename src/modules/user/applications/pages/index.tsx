import { useTranslation } from 'react-i18next';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui/tabs';

export default function Index() {
  const { t } = useTranslation(['auth', 'common']);
  return (
    <div>
      {t('menu.applications')}
      <Tabs defaultValue="account">
        <TabsList className="bg-white">
          <TabsTrigger value="account">Юридик шахс</TabsTrigger>
          <TabsTrigger value="password">Жисмоний шахс</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          Make changes to your account here.
        </TabsContent>
        <TabsContent value="password">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
}
