import { ResponseData } from '@/shared/types';

export interface BaseEntity {
  id: number;
  name: string;
}

export interface PaginationParams {
  page: number;
  size: number;
}

export interface BaseApi<T extends BaseEntity, F extends Record<string, any>> {
  getById(id: number): Promise<T>;
  delete(id: number): Promise<void>;
  getAll(params: PaginationParams & F): Promise<ResponseData<T>>;
  create(entity: Omit<T, 'id'>): Promise<T>;
  update(id: number, entity: Partial<Omit<T, 'id'>>): Promise<T>;
}
