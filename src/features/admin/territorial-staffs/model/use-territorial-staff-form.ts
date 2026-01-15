import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Direction, UserRoles } from '@/entities/user'
import { useCallback, useEffect, useMemo } from 'react'
import { useTranslatedObject } from '@/shared/hooks'
import { useOfficeSelectQueries } from '@/shared/api/dictionaries'
import { getSelectOptions } from '@/shared/lib/get-select-options'
import { useTerritorialStaffsDrawer } from '@/shared/hooks/entity-hooks'
import {
  CreateTerritorialStaffDTO,
  schemas,
  UpdateTerritorialStaffDTO,
  useCreateTerritorialStaff,
  useTerritorialStaffQuery,
  useUpdateTerritorialStaff,
} from '@/entities/admin/territorial-staffs'
import { parseISO } from 'date-fns'

const DEFAULT_FORM_VALUES: CreateTerritorialStaffDTO = {
  pin: '',
  fullName: '',
  officeId: '',
  position: '',
  birthDate: undefined as unknown as Date,
  directions: [],
  phoneNumber: '',
  role: UserRoles.REGIONAL,
}

export function useTerritorialStaffForm() {
  const { data, onClose, isCreate } = useTerritorialStaffsDrawer()

  const { data: officeSelect } = useOfficeSelectQueries()

  const userRoleOptions = useTranslatedObject(
    {
      [UserRoles.REGIONAL]: UserRoles.REGIONAL,
      [UserRoles.INSPECTOR]: UserRoles.INSPECTOR,
    },
    'userRoles'
  )

  const userPermissionOptions = useTranslatedObject(Direction, 'permission')

  const departmentOptions = useMemo(() => getSelectOptions(officeSelect || []), [officeSelect])

  const territorialStaffId = useMemo(() => (data?.id ? data?.id : ''), [data])

  const form = useForm<CreateTerritorialStaffDTO>({
    resolver: zodResolver(isCreate ? schemas.create : (schemas.update as any)),
    defaultValues: DEFAULT_FORM_VALUES,
    mode: 'onChange',
  })

  const { mutateAsync: createTerritorialStaff, isPending: isCreating } = useCreateTerritorialStaff()

  const { mutateAsync: updateTerritorialStaff, isPending: isUpdating } = useUpdateTerritorialStaff()

  const { data: fetchByIdData, isLoading } = useTerritorialStaffQuery(territorialStaffId)

  useEffect(() => {
    if (fetchByIdData && !isCreate) {
      form.reset({
        id: fetchByIdData.id,
        pin: String(fetchByIdData.pin),
        role: fetchByIdData.role,
        fullName: fetchByIdData.fullName,
        position: fetchByIdData.position,
        directions: fetchByIdData.directions,
        birthDate: fetchByIdData.birthDate ? parseISO(fetchByIdData.birthDate as unknown as string) : undefined,
        phoneNumber: fetchByIdData.phoneNumber,
        officeId: String(fetchByIdData.officeId),
      } as any)
    }
  }, [fetchByIdData, isCreate, form])

  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      console.error('[TerritorialStaffForm] Validation Errors:', form.formState.errors)
    }
  }, [form.formState.errors])

  const handleClose = useCallback(() => {
    form.reset(DEFAULT_FORM_VALUES)
    onClose()
  }, [form, onClose])

  const handleSubmit = useCallback(
    async (formData: CreateTerritorialStaffDTO): Promise<boolean> => {
      try {
        if (isCreate) {
          const response = await createTerritorialStaff(formData)
          if (response.success) {
            handleClose()
            return true
          }
        } else {
          const response = await updateTerritorialStaff({
            ...formData,
            id: territorialStaffId,
          } as UpdateTerritorialStaffDTO)
          if (response.success) {
            handleClose()
            return true
          }
        }

        return false
      } catch (error) {
        console.error('[useTerritorialStaffForm] Submission error:', error)
        return false
      }
    },
    [isCreate, territorialStaffId, createTerritorialStaff, updateTerritorialStaff, handleClose, fetchByIdData]
  )

  const isPending = isCreating || isUpdating

  return {
    form,
    isCreate,
    isPending,
    fetchByIdData,
    userRoleOptions,
    departmentOptions,
    userPermissionOptions,
    onSubmit: handleSubmit,
    isFetching: isLoading,
  }
}
