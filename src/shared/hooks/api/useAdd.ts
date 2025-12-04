import { CommonService } from '@/shared/api/dictionaries/queries/comon.api'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

const useAdd = <TVariables extends object, TData, TError>(
  endpoint: string,
  successMessage: string = 'Muvaffaqiyatli saqlandi!'
) => {
  return useMutation<TData, TError, TVariables>({
    mutationFn: (data: TVariables) => CommonService.addData<TVariables, TData>(endpoint, data),
    onSuccess: () => () => {
      if (successMessage) {
        toast.success(successMessage, {
          richColors: true,
        })
      }
    },
  })
}

export default useAdd
