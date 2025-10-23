import { useMutation } from '@tanstack/react-query';
import { postAppeal, AppealDto } from '../api/postAppeal'; // AppealDto'ni qayta import qilamiz

export const useSubmitAppeal = () => {
  return useMutation({
    // `mutationFn` endi `AppealDto` tipidagi argument qabul qiladi
    mutationFn: (appealData: AppealDto) => postAppeal(appealData),

    onSuccess: (data) => {
      console.log('Murojaat muvaffaqiyatli yuborildi:', data);
    },
    onError: (error) => {
      console.error('Mutatsiya xatoligi:', error);
    },
  });
};
