import { applicationDetailApi } from '@/features/application/application-detail/model/application-detail.api.ts'
import { useMutation } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

export function useUpdateRegisterFile(url?: string) {
  const { id = '' } = useParams()

  return useMutation({
    mutationFn: (payload: any) => applicationDetailApi.updateFile(id, payload, url),
  })
}
