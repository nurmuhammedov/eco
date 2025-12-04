import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect, useMemo } from 'react'
import { useHazardousFacilityTypeDrawer } from '@/shared/hooks/entity-hooks'
import {
  CreateHazardousFacilityTypeDTO,
  hazardousFacilityTypeSchema,
  UpdateHazardousFacilityTypeDTO,
  useCreateHazardousFacilityType,
  useHazardousFacilityTypeQuery,
  useUpdateHazardousFacilityType,
} from '@/entities/admin/hazardous-facility-type'

const DEFAULT_FORM_VALUES: CreateHazardousFacilityTypeDTO = {
  name: '',
  description: '',
}

export function useHazardousFacilityTypeForm() {
  const { data, onClose, isCreate } = useHazardousFacilityTypeDrawer()

  const selectedObjId = useMemo(() => (data?.id ? data?.id : 0), [data])

  const form = useForm<CreateHazardousFacilityTypeDTO>({
    resolver: zodResolver(hazardousFacilityTypeSchema),
    defaultValues: DEFAULT_FORM_VALUES,
    mode: 'onChange',
  })

  const { mutateAsync: createRegion, isPending: isCreating } = useCreateHazardousFacilityType()

  const { mutateAsync: updateRegion, isPending: isUpdating } = useUpdateHazardousFacilityType()

  const { data: fetchedData, isLoading } = useHazardousFacilityTypeQuery(selectedObjId)

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
    async (formData: CreateHazardousFacilityTypeDTO): Promise<boolean> => {
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
          } as UpdateHazardousFacilityTypeDTO)
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
