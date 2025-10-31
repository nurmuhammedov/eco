import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs.tsx';
import { useState } from 'react';
import { useAuth } from '@/shared/hooks/use-auth.ts';
import { UserRoles } from '@/entities/user';
import InspectionMainInfo from '@/features/inspections/ui/parts/inspection-main-info.tsx';
import AddInspectionDocuments from '@/features/inspections/ui/parts/add-inspection-documents.tsx';
import CreateDocument from '@/features/inspections/ui/parts/create-document.tsx';
import { useInspectionDetail } from '@/features/inspections/hooks/use-inspection-detail.ts';

const InpectionsDetailInfo = () => {
  const [activeTab, setActiveTab] = useState('main_info');
  const { user } = useAuth();
  const { data: inspectionData } = useInspectionDetail();

  const resetTab = () => {
    setActiveTab('main_info');
  };
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      {user?.role === UserRoles.INSPECTOR && (
        <TabsList className="bg-[#EDEEEE]">
          <TabsTrigger value="main_info">Umumiy ma’lumotlar</TabsTrigger>
          <TabsTrigger value="add_inspection_documents">Tekshiruv hujjatlari yuklash</TabsTrigger>
          {inspectionData?.status === 'IN_PROCESS' && (
            <TabsTrigger value="create_document">Dalolatnoma tuzish</TabsTrigger>
          )}
        </TabsList>
      )}
      <TabsContent value="main_info">
        <InspectionMainInfo />
      </TabsContent>
      <TabsContent value="add_inspection_documents">
        <AddInspectionDocuments />
      </TabsContent>
      <TabsContent value="create_document">
        <CreateDocument resetTab={resetTab} />
      </TabsContent>
    </Tabs>
  );
};
export default InpectionsDetailInfo;
