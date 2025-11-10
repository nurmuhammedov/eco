import { PermitTabs, PermitTable } from '@/features/permits';
import { PermitTabKey } from '@/entities/permit';
import { useCustomSearchParams } from '@/shared/hooks';
import { AddPermitModal } from '@/features/permits/ui/add-permit-modal';
import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';

export const PermitsWidget = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    paramsObject: { tab: activeTab = PermitTabKey.ALL },
    addParams,
  } = useCustomSearchParams();

  const handleTabChange = (tabKey: string) => {
    addParams({ tab: tabKey, page: '1' });
  };

  const tabCounts = {
    [PermitTabKey.ALL]: 5,
    [PermitTabKey.PERMIT]: 2,
    [PermitTabKey.LICENSE]: 2,
    [PermitTabKey.CONCLUSION]: 1,
    [PermitTabKey.NEARING_EXPIRY]: 1,
    [PermitTabKey.EXPIRED]: 1,
  };

  return (
    <>
      <div className="flex justify-between gap-2 items-center">
        <h1 className="text-2xl font-semibold">Ruxsatnomalar</h1>
        <Button type="button" onClick={() => setIsModalOpen((p) => !p)}>
          Qo‘shish
        </Button>
      </div>
      <div className="flex flex-col gap-5">
        <PermitTabs activeTab={activeTab} onTabChange={handleTabChange} counts={tabCounts} />
        <PermitTable data={[]} />
        <AddPermitModal open={isModalOpen} onOpenChange={setIsModalOpen} />
      </div>
    </>
  );
};
