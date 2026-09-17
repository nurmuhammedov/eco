import { useMutation } from '@tanstack/react-query'
import { AppealDto, postAppeal } from '../api/post-appeal'

export const useSubmitAppeal = () => {
  return useMutation({
    mutationFn: (appealData: AppealDto) => postAppeal(appealData),
  })
}
