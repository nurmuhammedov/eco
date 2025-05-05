import { useCallback } from 'react';
import { EntityMode } from './constants';
import { useFilters } from '@/shared/hooks/use-filters';

export function useEntityNavigation() {
  const { filters, setFilters, clearFilter } = useFilters();

  /**
   * Joriy mode va id ni olish
   */
  const getCurrentState = useCallback(() => {
    return {
      entityId: filters.id,
      mode: (filters.mode as EntityMode) || EntityMode.LIST,
    };
  }, [filters]);

  /**
   * LIST mode ga o'tish
   */
  const navigateToList = useCallback(() => {
    clearFilter('tab'); // tab parametri saqlanib qoladi
  }, [clearFilter]);

  /**
   * ADD mode ga o'tish
   */
  const navigateToAdd = useCallback(() => {
    setFilters({ id: null, mode: EntityMode.ADD });
  }, [setFilters]);

  /**
   * EDIT mode ga o'tish
   */
  const navigateToEdit = useCallback(
    (id: string) => {
      if (!id) {
        console.error('navigateToEdit: ID is required');
        return;
      }
      setFilters({ id, mode: EntityMode.EDIT });
    },
    [setFilters],
  );

  return {
    getCurrentState,
    navigateToList,
    navigateToAdd,
    navigateToEdit,
  };
}
