import { PlusIcon } from 'lucide-react';
import { UIModeEnum } from '@/shared/types';
import React, { useCallback, useState } from 'react';
import { EntityPage } from '@/widgets/admin/equipment';
import { Button } from '@/shared/components/ui/button';
import { CraneFormDialog } from '@/features/admin/crane';
import { useEquipmentDrawer } from '@/shared/hooks/entity-hooks';
import { CraneList } from '@/features/admin/crane/ui/crane-list';
import { filterParsers, useFilters } from '@/shared/hooks/use-filters';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { DEFAULT_EQUIPMENT, EQUIPMENT_CONFIG, getEquipmentById } from '@/shared/config/equipment-types';

const EquipmentPage: React.FC = () => {
  const { onOpen } = useEquipmentDrawer();
  const { filters, setFilters } = useFilters({
    'equipment-tab': filterParsers.string(DEFAULT_EQUIPMENT.id),
  });

  const activeTabId = filters.tab || DEFAULT_EQUIPMENT.id;
  const [activeTab, setActiveTab] = useState(activeTabId);
  const [activeEquipment, setActiveEquipment] = useState(getEquipmentById(activeTabId));

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setActiveEquipment(getEquipmentById(tabId));
    setFilters({ 'equipment-tab': tabId, mode: null, id: null });
  };

  const handleAddClick = useCallback(() => {
    if (filters['equipment-tab'] === activeTab) {
      onOpen(UIModeEnum.CREATE, { id: null });
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Xavfli obyektlar va qurilmalar</h1>
        <Button onClick={handleAddClick} className="flex-shrink-0">
          <PlusIcon className="size-4" /> {activeEquipment?.addLabel}
        </Button>
      </div>

      <Tabs
        value={activeTab}
        defaultValue={activeTab}
        onValueChange={(value) => handleTabChange(value)}
        className="w-full"
      >
        <TabsList className="h-auto border border-input overflow-x-auto">
          {EQUIPMENT_CONFIG.map((equipment) => (
            <TabsTrigger key={equipment.id} value={equipment.id}>
              <span className="hidden md:inline">{equipment.title}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <EntityTabContent equipmentId={activeTab} />
    </div>
  );
};

const EntityTabContent: React.FC<{
  equipmentId: string;
}> = ({ equipmentId }) => {
  const equipment = getEquipmentById(equipmentId);

  if (!equipment) {
    return <div className="p-4 bg-muted rounded-md">Equipment not found</div>;
  }

  switch (equipmentId) {
    case 'crane':
      return <CraneTabContent equipmentId={equipmentId} />;

    default:
      return <UnderDevelopmentTab equipmentId={equipmentId} />;
  }
};

const CraneTabContent: React.FC<{
  equipmentId: string;
}> = ({ equipmentId }) => {
  const cranePageConfig = {
    equipmentId,
    components: { ListComponent: CraneList, FormDialogComponent: CraneFormDialog },
  };

  return <EntityPage {...cranePageConfig} />;
};

const UnderDevelopmentTab: React.FC<{
  equipmentId: string;
}> = ({ equipmentId }) => {
  return (
    <div className="p-8 bg-muted/50 rounded-md text-center">
      <h3 className="text-xl font-medium mb-2">Ishlab chiqish jarayonida</h3>
      <p className="text-muted-foreground">
        "{getEquipmentById(equipmentId)?.title || equipmentId}" bo'limi hozirda ishlab chiqilmoqda.
      </p>
    </div>
  );
};

export default EquipmentPage;
