import { useCallback, useMemo } from 'react';
import { UIModeEnum } from '@/shared/types/ui-types';
import { HazardousFacilityActiveTab } from '../types';
import { filterParsers, useFilters } from '@/shared/hooks/use-filters';
import { useHazardousFacilityTypeDrawer } from '@/shared/hooks/entity-hooks';

export const useHazardousFacility = () => {
  const { filters, setFilters } = useFilters({
    'active-tab': filterParsers.string(HazardousFacilityActiveTab.HAZARDOUS_FACILITY_TYPE),
  });

  const { onOpen: openHazardousFacilityTypeDrawer, isOpen: isOpenHazardousFacilityType } =
    useHazardousFacilityTypeDrawer();

  const activeTab = useMemo<HazardousFacilityActiveTab>(
    () => filters['active-tab'] as HazardousFacilityActiveTab,
    [filters],
  );

  const handleChangeTab = useCallback(
    (tab: HazardousFacilityActiveTab) => setFilters((prev: any) => ({ ...prev, 'active-tab': tab })),
    [setFilters],
  );

  const onAddHazardousFacilityType = useCallback(() => {
    openHazardousFacilityTypeDrawer(UIModeEnum.CREATE);
  }, [openHazardousFacilityTypeDrawer]);

  return {
    filters,
    activeTab,
    handleChangeTab,
    onAddHazardousFacilityType,
    isOpenHazardousFacilityType,
  };
};
