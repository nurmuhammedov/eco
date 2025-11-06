import { useMutation } from '@tanstack/react-query';
import { inspectionsApi } from '@/features/inspections/model/inspections.model.ts';
import { useSearchParams } from 'react-router-dom';

export function useSetFiles() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('inspectionId');

  return useMutation({
    mutationFn: (data: any) => inspectionsApi.setFiles({ id, data }),
    onSuccess: async () => {},
  });
}
