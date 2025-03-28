import { UI_COMPONENTS } from '@/shared/types/ui-types';
import { createEntityDrawerHook } from '@/shared/lib/create-entity-hooks';

export const useRegionDrawer = createEntityDrawerHook(
  UI_COMPONENTS.REGION_DRAWER,
);

export const useDistrictDrawer = createEntityDrawerHook(
  UI_COMPONENTS.DISTRICT_DRAWER,
);

export const useCentralApparatusDrawer = createEntityDrawerHook(
  UI_COMPONENTS.CENTRAL_APPARATUS_DRAWER,
);

export const useTerritorialDepartmentsDrawer = createEntityDrawerHook(
  UI_COMPONENTS.TERRITORIAL_DEPARTMENTS_DRAWER,
);
