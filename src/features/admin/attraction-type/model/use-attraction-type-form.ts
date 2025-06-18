import {
  useCreateAttractionType,
  useUpdateAttractionType,
} from '@/entities/admin/attraction-type/hooks/use-attraction-type-mutations';
import {
  useAttractionsSelect,
  useAttractionTypeDetail,
} from '@/entities/admin/attraction-type/hooks/use-attraction-type-query';
import { schemas } from '@/entities/admin/attraction-type/models/attraction-type.schema';
import { CreateAttractionTypeDTO } from '@/entities/admin/attraction-type/models/attraction-type.types';
import { useAttractionTypeDrawer } from '@/shared/hooks/entity-hooks';
import { getSelectOptions } from '@/shared/lib/get-select-options';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

export function useAttractionTypeForm() {
  const { data, onClose, isCreate } = useAttractionTypeDrawer();

  const form = useForm<CreateAttractionTypeDTO>({
    resolver: zodResolver(schemas.create),
    defaultValues: { name: '', childEquipmentId: undefined },
  });

  const { data: attractionOptionsData, isLoading: isLoadingAttractions } = useAttractionsSelect();
  const attractionOptions = useMemo(
    () => getSelectOptions(attractionOptionsData?.data?.data || []),
    [attractionOptionsData],
  );

  const { mutateAsync: createAttractionType, isPending: isCreating } = useCreateAttractionType();
  const { mutateAsync: updateAttractionType, isPending: isUpdating } = useUpdateAttractionType();

  const { data: detailData, isLoading: isFetchingDetail } = useAttractionTypeDetail(data?.id);

  useEffect(() => {
    if (detailData?.data && !isCreate) {
      form.reset({
        name: detailData.data.data?.name,
        childEquipmentId: detailData.data?.data?.childEquipmentId,
      });
    }
  }, [detailData, isCreate, form]);

  const handleSubmit = async (formData: CreateAttractionTypeDTO) => {
    const response = isCreate
      ? await createAttractionType(formData)
      : await updateAttractionType({ id: data?.id, ...formData });

    if (response?.success) {
      onClose();
      form.reset();
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(handleSubmit),
    isPending: isCreating || isUpdating,
    isFetching: isFetchingDetail,
    isCreate,
    attractionOptions,
    isLoadingAttractions,
  };
}
