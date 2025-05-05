import { API_ENDPOINTS } from '@/shared/api';
import { Crane } from '@/entities/admin/crane';
import { createBaseApi } from '@/entities/base';

export const craneAPI = createBaseApi<Crane, any>(API_ENDPOINTS.EQUIPMENT_CRANE);
