import { useMutation } from '@tanstack/react-query'
import { inspectionsApi } from '@/features/inspections/model/inspections.model.ts'

export function useSetFiles() {
  return useMutation({
    mutationFn: (data: any) => inspectionsApi.setFiles({ id: data?.resultId, data }),
    onSuccess: async () => {},
  })
}
