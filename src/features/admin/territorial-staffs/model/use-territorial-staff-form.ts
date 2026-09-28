import { useForm } from 'react-hook-form'
import { Direction, UserRoles } from '@/shared/types/user'
import { useCallback, useEffect, useMemo } from 'react'
import { useTranslatedObject } from '@/shared/hooks'
import { useOfficeSelectQuery } from '@/shared/api/dictionaries'
import { getSelectOptions } from '@/shared/lib/get-select-options'
import { useTerritorialStaffsDrawer } from '@/shared/hooks/entity-hooks'
import { zodFormResolver } from '@/shared/lib/zod-form-resolver'
import type { z } from 'zod'
import {
  type TerritorialStaffFormValues,
  type TerritorialStaffPayload,
  territorialStaffSchema,
  useCreateTerritorialStaff,
  useTerritorialStaffQuery,
  useUpdateTerritorialStaff,
} from '@/entities/admin/territorial-staffs'

type TerritorialStaffValues = z.output<typeof territorialStaffSchema>

const DEFAULT_FORM_VALUES: TerritorialStaffFormValues = {
  pin: '',
  fullName: '',
  officeId: '',
  position: '',
  birthDate: undefined,
  directions: [],
  phoneNumber: '',
  role: UserRoles.REGIONAL,
}

export function useTerritorialStaffForm() {
  const { data, onClose, isCreate } = useTerritorialStaffsDrawer()

  const { data: officeSelect } = useOfficeSelectQuery()

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

  const form = useForm<TerritorialStaffFormValues, unknown, TerritorialStaffValues>({
    resolver: zodFormResolver<TerritorialStaffFormValues, TerritorialStaffValues>(territorialStaffSchema),
    defaultValues: DEFAULT_FORM_VALUES,
    mode: 'onChange',
  })

  const { mutate: createTerritorialStaff, isPending: isCreating } = useCreateTerritorialStaff()

  const { mutate: updateTerritorialStaff, isPending: isUpdating } = useUpdateTerritorialStaff()

  const { data: fetchByIdData, isLoading } = useTerritorialStaffQuery(territorialStaffId)

  // The detail names the office by id only; the select knows its name
  const officeName = officeSelect?.find((office) => office.id === fetchByIdData?.officeId)?.name

  useEffect(() => {
    if (fetchByIdData && !isCreate) {
      form.reset({
        pin: fetchByIdData.pin?.toString() ?? '',
        role: fetchByIdData.role ?? UserRoles.REGIONAL,
        fullName: fetchByIdData.fullName ?? '',
        position: fetchByIdData.position ?? '',
        directions: fetchByIdData.directions ?? [],
        phoneNumber: fetchByIdData.phoneNumber ?? '',
        officeId: fetchByIdData.officeId?.toString() ?? '',
      })
    }
  }, [fetchByIdData, isCreate, form])

  const handleClose = useCallback(() => {
    form.reset(DEFAULT_FORM_VALUES)
    onClose()
  }, [form, onClose])

  const handleSubmit = useCallback(
    ({ pin, officeId, fullName, position, role, directions, phoneNumber }: TerritorialStaffValues) => {
      const staff: TerritorialStaffPayload = {
        pin: Number(pin),
        officeId: Number(officeId),
        fullName,
        position,
        role,
        directions,
        phoneNumber,
      }
      if (isCreate) createTerritorialStaff(staff, { onSuccess: handleClose })
      else updateTerritorialStaff({ ...staff, id: territorialStaffId }, { onSuccess: handleClose })
    },
    [isCreate, territorialStaffId, createTerritorialStaff, updateTerritorialStaff, handleClose]
  )

  const isPending = isCreating || isUpdating

  return {
    form,
    isCreate,
    isPending,
    fetchByIdData,
    officeName,
    userRoleOptions,
    departmentOptions,
    userPermissionOptions,
    onSubmit: handleSubmit,
    isFetching: isLoading,
  }
}
