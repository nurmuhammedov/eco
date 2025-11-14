// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { ConclusionsTable, ConclusionTabs } from '@/features/expertise';
import { useCustomSearchParams, useData } from '@/shared/hooks';
import { TabKey } from '@/features/expertise/ui/conclusion-tabs';
import { Button } from '@/shared/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// import { ExpertiseTable } from '@/features/expertise/ui/expertise-table';
// import { PermitTabKey } from '@/entities/permit';

// enum InspectionSubMenuStatus {
//   ORGANIZATIONS = 'ORGANIZATIONS',
//   CONCLUSIONS = 'CONCLUSIONS',
// }

const ExpertiseWidget = () => {
  const {
    paramsObject: { tab = TabKey.ALL },
    addParams,
  } = useCustomSearchParams();
  const navigate = useNavigate();
  const handleTabChange = (tabKey: string) => {
    addParams({ tab: tabKey, page: '1' });
  };

  const { data } = useData<any>('/conclusions/count');

  const tabCounts = {
    [TabKey.ALL]: data?.allCount ?? 0,
    [TabKey.BI]: data?.bicount ?? 0,
    [TabKey.XD]: data?.xdcount ?? 0,
    [TabKey.TQ]: data?.tqcount ?? 0,
    [TabKey.LH]: data?.lhcount ?? 0,
    [TabKey.IX]: data?.ixcount ?? 0,
  };

  const handle = () => {
    navigate('/accreditations/add');
  };

  // return (
  //   <div>
  //     <Tabs
  //       value={activeTab || InspectionSubMenuStatus.CONCLUSIONS}
  //       onValueChange={(activeTab) => addParams({ mainTab: activeTab, page: '1' })}
  //     >
  //       {/*<TabsList>*/}
  //       {/*  <TabsTrigger value={InspectionSubMenuStatus.ORGANIZATIONS}>Ekspertiza tashkilotlari</TabsTrigger>*/}
  //       {/*  <TabsTrigger value={InspectionSubMenuStatus.CONCLUSIONS}>Ekspertiza xulosalari</TabsTrigger>*/}
  //       {/*</TabsList>*/}
  //       <TabsContent value={InspectionSubMenuStatus.CONCLUSIONS}>
  //         <div className="flex flex-col gap-5">
  //           <ConclusionTabs activeTab={tab} onTabChange={handleTabChange} counts={tabCounts} />
  //           <ConclusionsTable />
  //         </div>
  //       </TabsContent>
  //       <TabsContent value={InspectionSubMenuStatus.ORGANIZATIONS}>
  //         <ExpertiseTable />
  //       </TabsContent>
  //     </Tabs>
  //   </div>
  // );

  return (
    <>
      <div className="flex justify-end items-center">
        <Button onClick={handle}>
          <PlusCircle className="mr-2 h-4 w-4" /> Qo‘shish
        </Button>
      </div>
      <div className="flex flex-col gap-5">
        <ConclusionTabs activeTab={tab} onTabChange={handleTabChange} counts={tabCounts} />
        <ConclusionsTable />
      </div>
    </>
  );
};

export default ExpertiseWidget;
