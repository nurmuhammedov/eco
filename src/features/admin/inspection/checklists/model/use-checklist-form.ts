import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect, useMemo } from 'react'
import { useChecklistDrawer } from '@/shared/hooks/entity-hooks'
import {
  checklistSchema,
  type ChecklistFormValues,
  type CreateChecklistDTO,
  useChecklistQuery,
  useCreateChecklist,
  useUpdateChecklist,
} from '@/entities/admin/inspection'
import { useCategoryTypeSelectQuery } from '@/entities/admin/inspection/category-types/hooks/use-category-type-select-query'
import { useQueryClient } from '@tanstack/react-query'
import { invalidateEndpoint } from '@/shared/lib/query/endpoint-key'

const DEFAULT_VALUES: ChecklistFormValues = {
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

  const form = useForm<ChecklistFormValues>({
    resolver: zodResolver(checklistSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onBlur',
  })

  const queryClient = useQueryClient()

  const { data: categoryTypes } = useCategoryTypeSelectQuery(form.watch('category'))
  const { mutate: createItem, isPending: isCreating } = useCreateChecklist()
  const { mutate: updateItem, isPending: isUpdating } = useUpdateChecklist()
  const { data: checklistData, isLoading } = useChecklistQuery(checklistId)

  useEffect(() => {
    if (checklistData && !isCreate) {
      form.reset({
        categoryTypeId: checklistData.categoryId?.toString() ?? '',
        corrective: checklistData.corrective ?? '',
        orderNumber: checklistData.orderNumber?.toString() ?? '',
        negative: checklistData.negative ?? '',
        question: checklistData.question ?? '',
        category: checklistData.category ?? '',
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
    ({ categoryTypeId, orderNumber, question, negative, corrective }: ChecklistFormValues) => {
      const categoryId = Number(categoryTypeId)
      const checklist: CreateChecklistDTO = {
        categoryId,
        orderNumber: Number(orderNumber),
        question,
        negative,
        corrective,
      }
      const onSuccess = () => {
        handleClose()
        void invalidateEndpoint(queryClient, `/checklists/by-category/${categoryId}`)
      }

      if (isCreate) createItem(checklist, { onSuccess })
      else updateItem({ ...checklist, id: checklistId }, { onSuccess })
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
