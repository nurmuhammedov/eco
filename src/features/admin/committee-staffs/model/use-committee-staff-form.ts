import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UseQueryResult } from '@tanstack/react-query';
import { UserRoles } from '@/entities/user';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslatedObject } from '@/shared/hooks';
import { getSelectOptions } from '@/shared/lib/get-select-options.tsx';
import { useDepartmentSelectQueries } from '@/shared/api/dictionaries';
import { useCommitteeStaffsDrawer } from '@/shared/hooks/entity-hooks';
import {
  CommitteeStaffResponse,
  committeeStaffSchema,
  CreateCommitteeStaffDTO,
  UpdateCommitteeStaffDTO,
  useCommitteeStaffQuery,
  useCreateCommitteeStaff,
  useUpdateCommitteeStaff,
} from '@/entities/admin/committee-staffs';
import { PERMISSIONS } from '@/entities/permission';

const DEFAULT_FORM_VALUES: CreateCommitteeStaffDTO = {
  pin: '',
  fullName: '',
  position: '',
  directions: [],
  phoneNumber: '',
  departmentId: '',
  role: UserRoles.HEAD,
};

export function useCommitteeStaffForm() {
  const { data, onClose, isCreate } = useCommitteeStaffsDrawer();

  const { data: departmentSelect } = useDepartmentSelectQueries();

  const userRoleOptions = useTranslatedObject(
    {
      [UserRoles.HEAD]: UserRoles.HEAD,
      [UserRoles.MANAGER]: UserRoles.MANAGER,
      [UserRoles.CHAIRMAN]: UserRoles.CHAIRMAN,
    },
    'userRoles',
  );

  const userPermissionOptions = useTranslatedObject(PERMISSIONS, 'permission');

  const departmentOptions = useMemo(() => getSelectOptions(departmentSelect || []), [departmentSelect]);

  const committeeStaffId = useMemo(() => (data?.id ? data?.id : ''), [data]);

  const form = useForm<CreateCommitteeStaffDTO>({
    resolver: zodResolver(committeeStaffSchema),
    defaultValues: DEFAULT_FORM_VALUES,
    mode: 'onChange',
  });

  const { mutateAsync: createCommitteeStaff, isPending: isCreating } = useCreateCommitteeStaff();

  const { mutateAsync: updateCommitteeStaff, isPending: isUpdating } = useUpdateCommitteeStaff();

  const { data: fetchByIdData, isLoading } = useCommitteeStaffQuery(
    committeeStaffId,
  ) as UseQueryResult<CommitteeStaffResponse>;

  useEffect(() => {
    if (fetchByIdData && !isCreate) {
      form.reset({
        pin: fetchByIdData.pin,
        role: fetchByIdData.role,
        fullName: fetchByIdData.fullName,
        position: fetchByIdData.position,
        directions: fetchByIdData.directions,
        phoneNumber: fetchByIdData.phoneNumber,
        departmentId: String(fetchByIdData.departmentId),
      });
    }
  }, [fetchByIdData, isCreate, form]);

  const handleClose = useCallback(() => {
    form.reset(DEFAULT_FORM_VALUES);
    onClose();
  }, [form, onClose]);

  const handleSubmit = useCallback(
    async (formData: CreateCommitteeStaffDTO): Promise<boolean> => {
      console.log(formData, 'formData');
      try {
        if (isCreate) {
          const response = await createCommitteeStaff(formData);
          if (response.success) {
            handleClose();
            return true;
          }
        } else {
          const response = await updateCommitteeStaff({
            id: committeeStaffId,
            ...formData,
            directions: formData.directions?.filter((i) => i != 'ATTESTATION'),
          } as UpdateCommitteeStaffDTO);
          if (response.success) {
            handleClose();
            return true;
          }
        }

        return false;
      } catch (error) {
        console.error('[useEquipmentForm] Submission error:', error);
        return false;
      }
    },
    [isCreate, committeeStaffId, createCommitteeStaff, updateCommitteeStaff, handleClose, fetchByIdData],
  );

  const isPending = isCreating || isUpdating;

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
  };
}
