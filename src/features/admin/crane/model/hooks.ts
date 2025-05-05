import { Crane, craneAPI } from '@/entities/admin/crane';
import { createAddHook, createDeleteHook, createDetailHook, createEditHook, createListHook } from '@/features/abstract';

export const useAddCrane = createAddHook<Crane, any>(craneAPI, 'crane');
export const useEditCrane = createEditHook<Crane, any>(craneAPI, 'crane');
export const useListCrane = createListHook<Crane, any>(craneAPI, 'crane');
export const useDetailCrane = createDetailHook<Crane, any>(craneAPI, 'crane');
export const useDeleteCrane = createDeleteHook<Crane, any>(craneAPI, 'crane');
