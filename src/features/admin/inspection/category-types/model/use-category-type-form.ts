import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect, useMemo } from 'react'
import { useCategoryTypeDrawer } from '@/shared/hooks/entity-hooks'
import {
  categoryTypeSchema,
  type CreateCategoryTypeDTO,
  useCategoryTypeQuery,
  useCreateCategoryType,
  useUpdateCategoryType,
} from '@/entities/admin/inspection'

const DEFAULT_VALUES: CreateCategoryTypeDTO = {
  type: '',
  name: '',
}

export function useCategoryTypeForm() {
  const { data, onClose, isCreate } = useCategoryTypeDrawer()
  const categoryTypeId = useMemo(() => (data?.id ? data.id : 0), [data])

  const form = useForm<CreateCategoryTypeDTO>({
    resolver: zodResolver(categoryTypeSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onChange',
  })

  const { mutate: createItem, isPending: isCreating } = useCreateCategoryType()
  const { mutate: updateItem, isPending: isUpdating } = useUpdateCategoryType()
  const { data: categoryTypeData, isLoading } = useCategoryTypeQuery(categoryTypeId)

  useEffect(() => {
    if (categoryTypeData && !isCreate) {
      form.reset({
        type: categoryTypeData.type ?? '',
        name: categoryTypeData.name ?? '',
      })
    }
  }, [categoryTypeData, isCreate, form])

  const handleClose = useCallback(() => {
    form.reset(DEFAULT_VALUES)
    onClose()
  }, [form, onClose])

  const handleSubmit = useCallback(
    (values: CreateCategoryTypeDTO) => {
      if (isCreate) createItem(values, { onSuccess: handleClose })
      else updateItem({ ...values, id: categoryTypeId }, { onSuccess: handleClose })
    },
    [isCreate, categoryTypeId, createItem, updateItem, handleClose]
  )

  return {
    form,
    categoryTypeData,
    isCreate,
    onSubmit: handleSubmit,
    isFetching: isLoading,
    isPending: isCreating || isUpdating,
  }
}
