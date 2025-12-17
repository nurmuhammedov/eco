import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UseQueryResult } from '@tanstack/react-query'
import { UserRoles } from '@/entities/user'
import { useCallback, useEffect, useMemo } from 'react'
import { useTranslatedObject } from '@/shared/hooks'
import { getSelectOptions } from '@/shared/lib/get-select-options.tsx'
import { useDepartmentSelectQueries } from '@/shared/api/dictionaries'
import { useCommitteeStaffsDrawer } from '@/shared/hooks/entity-hooks'

import {
  CommitteeStaffResponse,
  useCommitteeStaffQuery,
  useCreateCommitteeStaff,
  useUpdateCommitteeStaff,
} from '@/entities/admin/committee-staffs'
import {
  type CreateCommitteeStaffDTO,
  schemas,
  type UpdateCommitteeStaffDTO,
} from '@/entities/admin/committee-staffs/models/committee-staffs.schema'
import { format, parseISO } from 'date-fns'

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
  ATTESTATION_COMMITTEE: 'ATTESTATION_COMMITTEE',
  ACCREDITATION: 'ACCREDITATION',
  CADASTRE: 'CADASTRE',
  PERMITS: 'PERMITS',
  REPORT: 'REPORT',
  INQUIRY: 'INQUIRY',
}

const DEFAULT_FORM_VALUES: Partial<CreateCommitteeStaffDTO> = {
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

  const { data: departmentSelect } = useDepartmentSelectQueries()
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

  const form = useForm<CreateCommitteeStaffDTO>({
    resolver: zodResolver(isCreate ? schemas.create : (schemas.update as any)),
    defaultValues: DEFAULT_FORM_VALUES as CreateCommitteeStaffDTO,
    mode: 'onChange',
  })

  const { mutateAsync: createCommitteeStaff, isPending: isCreating } = useCreateCommitteeStaff()
  const { mutateAsync: updateCommitteeStaff, isPending: isUpdating } = useUpdateCommitteeStaff()

  const { data: fetchByIdData, isLoading } = useCommitteeStaffQuery(
    committeeStaffId
  ) as UseQueryResult<CommitteeStaffResponse>

  useEffect(() => {
    if (fetchByIdData && !isCreate) {
      const valuesToReset = {
        pin: fetchByIdData.pin,
        role: fetchByIdData.role,
        fullName: fetchByIdData.fullName,
        position: fetchByIdData.position,
        phoneNumber: fetchByIdData.phoneNumber,
        departmentId: String(fetchByIdData.departmentId),
        directions: Array.isArray(fetchByIdData.directions) ? fetchByIdData.directions : [],
        birthDate: fetchByIdData.birthDate ? parseISO(fetchByIdData.birthDate as any) : undefined,
      }

      form.reset(valuesToReset as any)
    }
  }, [fetchByIdData, isCreate, form])

  const handleClose = useCallback(() => {
    form.reset(DEFAULT_FORM_VALUES as any)
    onClose()
  }, [form, onClose])

  const handleSubmit = useCallback(
    async (formData: CreateCommitteeStaffDTO | UpdateCommitteeStaffDTO): Promise<boolean> => {
      try {
        if (isCreate) {
          const createData = formData as CreateCommitteeStaffDTO
          const dataToSend = {
            ...createData,
            birthDate: format(createData.birthDate, 'yyyy-MM-dd'),
          }
          const response = await createCommitteeStaff(dataToSend as any)
          if (response.success) handleClose()
        } else {
          const updateData = formData as UpdateCommitteeStaffDTO

          const formattedBirthDate =
            updateData.birthDate instanceof Date ? format(updateData.birthDate, 'yyyy-MM-dd') : undefined

          const directions = Array.isArray(updateData.directions)
            ? updateData.directions.filter((i: string) => i !== 'ATTESTATION')
            : []

          const dataToSend = {
            ...updateData,
            birthDate: formattedBirthDate,
            directions,
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { id, ...restOfData } = dataToSend

          const payload = {
            ...restOfData,
            id: committeeStaffId,
            birthDate: updateData.birthDate,
          }

          const response = await updateCommitteeStaff(payload as any)
          if (response.success) handleClose()
        }
        return true
      } catch (error) {
        console.error('[useCommitteeStaffForm] Submission error:', error)
        return false
      }
    },
    [isCreate, committeeStaffId, createCommitteeStaff, updateCommitteeStaff, handleClose]
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
