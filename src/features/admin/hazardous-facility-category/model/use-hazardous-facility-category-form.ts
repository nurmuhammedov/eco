import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect, useMemo } from 'react'
import { useHazardousFacilityCategoryDrawer } from '@/shared/hooks/entity-hooks'
import {
  CreateHazardousFacilityCategoryDTO,
  hazardousFacilityCategorySchema,
  UpdateHazardousFacilityCategoryDTO,
  useCreateHazardousFacilityCategory,
  useHazardousFacilityCategoryQuery,
  useUpdateHazardousFacilityCategory,
} from '@/entities/admin/hazardous-facility-category'

const DEFAULT_FORM_VALUES: CreateHazardousFacilityCategoryDTO = {
  name: '',
}

export function useHazardousFacilityCategoryForm() {
  const { data, onClose, isCreate } = useHazardousFacilityCategoryDrawer()

  const selectedObjId = useMemo(() => (data?.id ? data?.id : 0), [data])

  const form = useForm<CreateHazardousFacilityCategoryDTO>({
    resolver: zodResolver(hazardousFacilityCategorySchema),
    defaultValues: DEFAULT_FORM_VALUES,
    mode: 'onChange',
  })

  const { mutateAsync: createRegion, isPending: isCreating } = useCreateHazardousFacilityCategory()

  const { mutateAsync: updateRegion, isPending: isUpdating } = useUpdateHazardousFacilityCategory()

  const { data: fetchedData, isLoading } = useHazardousFacilityCategoryQuery(selectedObjId)

  useEffect(() => {
    if (fetchedData && !isCreate) {
      form.reset(fetchedData)
    }
  }, [fetchedData, isCreate, form])

  const handleClose = useCallback(() => {
    form.reset(DEFAULT_FORM_VALUES)
    onClose()
  }, [form, onClose])

  const handleSubmit = useCallback(
    async (formData: CreateHazardousFacilityCategoryDTO): Promise<boolean> => {
      try {
        if (isCreate) {
          const response = await createRegion(formData)
          if (response.success) {
            handleClose()
            return true
          }
        } else {
          const response = await updateRegion({
            id: selectedObjId,
            ...formData,
          } as UpdateHazardousFacilityCategoryDTO)
          if (response.success) {
            handleClose()
            return true
          }
        }

        return false
      } catch (error) {
        console.error('[useEquipmentForm] Submission error:', error)
        return false
      }
    },
    [isCreate, selectedObjId, createRegion, updateRegion, handleClose]
  )

  const isPending = isCreating || isUpdating

  return {
    form,
    isCreate,
    isPending,
    fetchedData,
    isFetching: isLoading,
    onSubmit: handleSubmit,
  }
}
