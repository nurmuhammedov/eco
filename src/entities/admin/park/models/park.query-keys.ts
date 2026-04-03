import { FilterParkDTO } from './park.types'

export const parkKeys = {
  all: ['parks'] as const,
  lists: () => [...parkKeys.all, 'list'] as const,
  list: (params: FilterParkDTO) => [...parkKeys.lists(), { params }] as const,
  details: () => [...parkKeys.all, 'detail'] as const,
  detail: (id: number) => [...parkKeys.details(), id] as const,
  entity: (key: string) => [...parkKeys.all, key] as const,
}
