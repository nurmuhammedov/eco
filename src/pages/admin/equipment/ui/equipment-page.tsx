import React from 'react';
import { PlusIcon } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useFilters } from '@/shared/hooks/use-filters';
import { EntityMode, EntityPage } from '@/widgets/admin/equipment';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { EQUIPMENT_CONFIG, getEquipmentById } from '@/shared/config/equipment-types';
import { CraneList } from '@/features/admin/crane/ui/crane-list';
import { CraneFormDialog } from '@/features/admin/crane';

const EquipmentPage: React.FC = () => {
  const { filters, setFilters } = useFilters();

  // 'tab' query parametridan active equipment ni olish
  const activeTabId = filters.tab || EQUIPMENT_CONFIG[0].id;
  const activeEquipment = getEquipmentById(activeTabId) || EQUIPMENT_CONFIG[0];

  // Tab o'zgarganda, 'tab' query parametrini yangilash
  const handleTabChange = (tabId: string) => {
    setFilters({ tab: tabId, id: null, mode: null });
  };

  // Qo'shish tugmasi bosilganda
  const handleAddClick = () => {
    setFilters({ mode: EntityMode.ADD, id: null });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">ХАВФЛИ ОБЪЕКТЛАР ВА ҚУРИЛМАЛАР</h1>
        <Button onClick={handleAddClick} className="flex-shrink-0">
          <PlusIcon className="size-4" /> {activeEquipment.addLabel}
        </Button>
      </div>

      <Tabs value={activeTabId} onValueChange={handleTabChange} className="w-full">
        <TabsList className="h-auto border border-input overflow-x-auto">
          {EQUIPMENT_CONFIG.map((equipment) => {
            return (
              <TabsTrigger key={equipment.id} value={equipment.id}>
                <span className="hidden md:inline">{equipment.title}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      {/* Dinamik ravishda tegishli entity page'ni render qilish */}
      <EntityTabContent equipmentId={activeEquipment.id} addButtonLabel={activeEquipment.addLabel} />
    </div>
  );
};

/**
 * Tab tarkibini dinamik ravishda yaratuvchi komponent
 */
const EntityTabContent: React.FC<{
  equipmentId: string;
  addButtonLabel: string;
}> = ({ equipmentId, addButtonLabel }) => {
  // Jihozni olish
  const equipment = getEquipmentById(equipmentId);

  if (!equipment) {
    return <div className="p-4 bg-muted rounded-md">Equipment not found</div>;
  }

  // Har bir jihoz turi uchun tegishli komponentlarni render qilish
  switch (equipmentId) {
    case 'crane':
      return <CraneTabContent equipmentId={equipmentId} addButtonLabel={addButtonLabel} />;

    // Boshqa jihoz turlari uchun...

    default:
      return <UnderDevelopmentTab equipmentId={equipmentId} />;
  }
};

/**
 * Kran tab content komponenti
 */
const CraneTabContent: React.FC<{
  equipmentId: string;
  addButtonLabel: string;
}> = ({ equipmentId, addButtonLabel }) => {
  // Kran uchun konfiguratsiya
  const cranePageConfig = {
    components: {
      ListComponent: CraneList,
      FormDialogComponent: CraneFormDialog,
    },
    equipmentId,
    title: 'Kranlar boshqaruvi',
    addButtonLabel,
    className: 'crane-entity-page',
  };

  return <EntityPage {...cranePageConfig} />;
};

/**
 * Ishlab chiqish jarayonidagi komponentlar uchun placeholder
 */
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
