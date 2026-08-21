import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect, useMemo } from 'react'
import { useChecklistDrawer } from '@/shared/hooks/entity-hooks'
import {
  checklistSchema,
  CreateChecklistDTO,
  UpdateChecklistDTO,
  useChecklistQuery,
  useCreateChecklist,
  useUpdateChecklist,
} from '@/entities/admin/inspection'
import { useCategoryTypeSelectQuery } from '@/entities/admin/inspection/category-types/hooks/use-category-type-select-query'
import { useQueryClient } from '@tanstack/react-query'

const DEFAULT_VALUES: CreateChecklistDTO = {
  category: '',
  categoryTypeId: '',
  orderNumber: '',
  question: '',
  negative: '',
  corrective: '',
}

export function useChecklistForm() {
  const { data, onClose, isCreate } = useChecklistDrawer()
  const checklistId = useMemo(() => (data?.id ? data.id : 0), [data])

  const form = useForm<CreateChecklistDTO>({
    resolver: zodResolver(checklistSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onBlur',
  })

  const queryClient = useQueryClient()

  const { data: categoryTypes } = useCategoryTypeSelectQuery(form?.watch('category'))
  const { mutateAsync: createItem, isPending: isCreating } = useCreateChecklist()
  const { mutateAsync: updateItem, isPending: isUpdating } = useUpdateChecklist()
  const { data: checklistData, isLoading } = useChecklistQuery(checklistId)

  useEffect(() => {
    if (checklistData && !isCreate) {
      form.reset({
        categoryTypeId: checklistData.categoryTypeId?.toString(),
        corrective: checklistData.corrective,
        orderNumber: checklistData.orderNumber,
        negative: checklistData.negative,
        question: checklistData.question,
        category: checklistData.category?.toString(),
      })
    } else if (isCreate && data) {
      form.reset({
        ...DEFAULT_VALUES,
        category: data.category?.toString() || '',
        categoryTypeId: data.categoryTypeId?.toString() || '',
        orderNumber: data.orderNumber?.toString() || '',
      })
    }
  }, [checklistData, isCreate, form, data])

  const handleClose = useCallback(() => {
    form.reset(DEFAULT_VALUES)
    onClose()
  }, [form, onClose])

  const handleSubmit = useCallback(
    async (formData: CreateChecklistDTO): Promise<boolean> => {
      try {
        const payload = {
          ...formData,
          categoryId: Number(formData?.categoryTypeId) || undefined,
        }

        const response = isCreate
          ? await createItem(payload as CreateChecklistDTO)
          : await updateItem({ id: checklistId, ...payload } as UpdateChecklistDTO)

        if (response.success) {
          handleClose()
          if (payload.categoryId) {
            queryClient.invalidateQueries({ queryKey: [`/checklists/by-category/${payload.categoryId}`] })
          }
          return true
        }
        return false
      } catch (error) {
        console.error('[useChecklistForm] Submission error:', error)
        return false
      }
    },
    [isCreate, checklistId, createItem, updateItem, handleClose, queryClient]
  )

  return {
    form,
    isCreate,
    checklistData,
    categoryTypes,
    onSubmit: handleSubmit,
    isFetching: isLoading,
    isPending: isCreating || isUpdating,
    drawerData: data,
  }
}
