import { useMutation } from '@tanstack/react-query';
import { postAppeal, AppealDto } from '../api/postAppeal';

export const useSubmitAppeal = () => {
  return useMutation({
    mutationFn: (appealData: AppealDto) => postAppeal(appealData),
  });
};
