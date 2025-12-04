import { useForm } from 'react-hook-form'
import { useTranslatedObject } from '@/shared/hooks'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect, useMemo } from 'react'
import { useEquipmentDrawer } from '@/shared/hooks/entity-hooks'
import { getSelectOptions } from '@/shared/lib/get-select-options'
import {
  CreateEquipmentDTO,
  equipmentSchema,
  EquipmentTypeEnum,
  UpdateEquipmentDTO,
  useCreateEquipment,
  useEquipmentDetail,
  useUpdateEquipment,
} from '@/entities/admin/equipment'

const DEFAULT_FORM_VALUES: CreateEquipmentDTO = {
  name: '',
  equipmentType: '' as EquipmentTypeEnum.BOILER,
}

export function useEquipmentForm() {
  const { data, onClose, isCreate } = useEquipmentDrawer()

  const equipmentId = useMemo(() => (data?.id ? data?.id : 0), [data])

  const form = useForm<CreateEquipmentDTO>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  })

  const equipmentTypes = useTranslatedObject(EquipmentTypeEnum, 'equipment_types')

  const equipmentTypeOptions = getSelectOptions(equipmentTypes)

  const { mutateAsync: createRegion, isPending: isCreating } = useCreateEquipment()

  const { mutateAsync: updateEquipment, isPending: isUpdating } = useUpdateEquipment()

  const { data: districtData, isLoading } = useEquipmentDetail(equipmentId)

  useEffect(() => {
    if (districtData && !isCreate) {
      form.reset({ ...districtData, equipmentType: districtData.equipmentType })
    }
  }, [districtData, form])

  const handleClose = useCallback(() => {
    onClose()
    form.reset(DEFAULT_FORM_VALUES)
  }, [form, onClose])

  const handleSubmit = useCallback(
    async (formData: CreateEquipmentDTO): Promise<boolean> => {
      try {
        if (isCreate) {
          const response = await createRegion(formData)
          if (response.success) {
            handleClose()
            return true
          }
        } else {
          const response = await updateEquipment({
            id: equipmentId,
            ...formData,
          } as UpdateEquipmentDTO)
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
    [isCreate, equipmentId, createRegion, updateEquipment, handleClose]
  )

  const isPending = isCreating || isUpdating

  return {
    form,
    isCreate,
    isPending,
    districtData,
    equipmentTypeOptions,
    onSubmit: handleSubmit,
    isFetching: isLoading,
  }
}
