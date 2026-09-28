import { useForm } from 'react-hook-form'
import { UserRoles } from '@/shared/types/user'
import { useCallback, useEffect, useMemo } from 'react'
import { useTranslatedObject } from '@/shared/hooks'
import { getSelectOptions } from '@/shared/lib/get-select-options'
import { useDepartmentSelectQuery } from '@/shared/api/dictionaries'
import { useCommitteeStaffsDrawer } from '@/shared/hooks/entity-hooks'
import { zodFormResolver } from '@/shared/lib/zod-form-resolver'
import type { z } from 'zod'

import {
  type CommitteeStaffPayload,
  useCommitteeStaffQuery,
  useCreateCommitteeStaff,
  useUpdateCommitteeStaff,
} from '@/entities/admin/committee-staffs'
import {
  type CommitteeStaffFormValues,
  committeeStaffSchema,
} from '@/entities/admin/committee-staffs/model/committee-staffs.schema'

type CommitteeStaffValues = z.output<typeof committeeStaffSchema>

const PERMISSIONS = {
  HF: 'HF',
  EQUIPMENT: 'EQUIPMENT',
  IRS: 'IRS',
  XRAY: 'XRAY',
  APPEAL: 'APPEAL',
  REGISTRY: 'REGISTRY',
  PREVENTION: 'PREVENTION',
  RISK_ANALYSIS: 'RISK_ANALYSIS',
  INSPECTION: 'INSPECTION',
  ACCREDITATION: 'ACCREDITATION',
  CONCLUSION: 'CONCLUSION',
  DECLARATION: 'DECLARATION',
  PERMITS: 'PERMITS',
  REPORT: 'REPORT',
  INQUIRY: 'INQUIRY',
  ATTESTATION: 'ATTESTATION',
  ACCIDENT: 'ACCIDENT',
  ELEVATOR: 'ELEVATOR',
  ANNOUNCEMENT: 'ANNOUNCEMENT',
  ARCHIVE: 'ARCHIVE',
  KPI: 'KPI',
}

const DEFAULT_FORM_VALUES: CommitteeStaffFormValues = {
  pin: '',
  fullName: '',
  position: '',
  birthDate: undefined,
  directions: [],
  phoneNumber: '',
  departmentId: '',
  role: UserRoles.HEAD,
}

export function useCommitteeStaffForm() {
  const { data, onClose, isCreate } = useCommitteeStaffsDrawer()

  const { data: departmentSelect } = useDepartmentSelectQuery()
  const userRoleOptions = useTranslatedObject(
    {
      [UserRoles.HEAD]: UserRoles.HEAD,
      [UserRoles.MANAGER]: UserRoles.MANAGER,
      [UserRoles.CHAIRMAN]: UserRoles.CHAIRMAN,
    },
    'userRoles'
  )
  const userPermissionOptions = useTranslatedObject(PERMISSIONS, 'permission')
  const departmentOptions = useMemo(() => getSelectOptions(departmentSelect || []), [departmentSelect])
  const committeeStaffId = useMemo(() => (data?.id ? data?.id : ''), [data])

  const form = useForm<CommitteeStaffFormValues, unknown, CommitteeStaffValues>({
    resolver: zodFormResolver<CommitteeStaffFormValues, CommitteeStaffValues>(committeeStaffSchema),
    defaultValues: DEFAULT_FORM_VALUES,
    mode: 'onChange',
  })

  const { mutate: createCommitteeStaff, isPending: isCreating } = useCreateCommitteeStaff()
  const { mutate: updateCommitteeStaff, isPending: isUpdating } = useUpdateCommitteeStaff()

  const { data: fetchByIdData, isLoading } = useCommitteeStaffQuery(committeeStaffId)

  // The detail names the department by id only; the select knows its name
  const departmentName = departmentSelect?.find((department) => department.id === fetchByIdData?.departmentId)?.name

  useEffect(() => {
    if (fetchByIdData && !isCreate) {
      form.reset({
        pin: fetchByIdData.pin?.toString() ?? '',
        role: fetchByIdData.role ?? UserRoles.HEAD,
        fullName: fetchByIdData.fullName ?? '',
        position: fetchByIdData.position ?? '',
        phoneNumber: fetchByIdData.phoneNumber ?? '',
        departmentId: fetchByIdData.departmentId?.toString() ?? '',
        directions: fetchByIdData.directions ?? [],
      })
    }
  }, [fetchByIdData, isCreate, form])

  const handleClose = useCallback(() => {
    form.reset(DEFAULT_FORM_VALUES)
    onClose()
  }, [form, onClose])

  const handleSubmit = useCallback(
    ({ pin, departmentId, fullName, position, role, directions, phoneNumber }: CommitteeStaffValues) => {
      const staff: CommitteeStaffPayload = {
        pin: Number(pin),
        departmentId: Number(departmentId),
        fullName,
        position,
        role,
        directions,
        phoneNumber,
      }
      if (isCreate) createCommitteeStaff(staff, { onSuccess: handleClose })
      else updateCommitteeStaff({ ...staff, id: committeeStaffId }, { onSuccess: handleClose })
    },
    [isCreate, committeeStaffId, createCommitteeStaff, updateCommitteeStaff, handleClose]
  )

  const isPending = isCreating || isUpdating

  return {
    form,
    isCreate,
    isPending,
    fetchByIdData,
    departmentName,
    userRoleOptions,
    departmentOptions,
    userPermissionOptions,
    onSubmit: handleSubmit,
    isFetching: isLoading,
  }
}
