import { CommonService } from '@/shared/api/dictionaries/queries/comon.api';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

const useDelete = (
  endpoint: string,
  id?: string | number | boolean | null,
  successMessage: string = 'Deleted successfully',
) => {
  return useMutation({
    mutationFn: (ID?: number) => {
      if (id || ID) {
        return CommonService.deleteData(endpoint, id?.toString() || ID?.toString() || '');
      } else {
        toast.error('ID is required to perform delete operation');
        return Promise.reject();
      }
    },
    onSuccess: () => toast.success(successMessage),
  });
};

export default useDelete;
