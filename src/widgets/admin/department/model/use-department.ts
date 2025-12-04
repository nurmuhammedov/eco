import { DepartmentActiveTab } from '../types'
import { useCallback, useMemo } from 'react'
import { UIModeEnum } from '@/shared/types/ui-types'
import { filterParsers, useFilters } from '@/shared/hooks/use-filters'
import { useCentralApparatusDrawer, useTerritorialDepartmentsDrawer } from '@/shared/hooks/entity-hooks'

export const useDepartment = () => {
  const { filters, setFilters } = useFilters({
    'active-tab': filterParsers.string(DepartmentActiveTab.CENTRAL_APPARATUS),
  })

  const { onOpen: openCentralApparatusDrawer, isOpen: isOpenCentralApparatus } = useCentralApparatusDrawer()

  const { onOpen: openTerritorialDepartmentsDrawer, isOpen: isOpenTerritorialDepartments } =
    useTerritorialDepartmentsDrawer()

  const activeTab = useMemo<DepartmentActiveTab>(() => filters['active-tab'] as DepartmentActiveTab, [filters])

  const handleChangeTab = useCallback(
    (tab: DepartmentActiveTab) => setFilters((prev: any) => ({ ...prev, 'active-tab': tab })),
    [setFilters]
  )

  const onAddApparatus = useCallback(() => {
    openCentralApparatusDrawer(UIModeEnum.CREATE)
  }, [openCentralApparatusDrawer])

  const onAddDepartment = useCallback(() => {
    openTerritorialDepartmentsDrawer(UIModeEnum.CREATE)
  }, [openTerritorialDepartmentsDrawer])

  return {
    filters,
    activeTab,
    onAddApparatus,
    onAddDepartment,
    handleChangeTab,
    isOpenCentralApparatus,
    isOpenTerritorialDepartments,
  }
}
