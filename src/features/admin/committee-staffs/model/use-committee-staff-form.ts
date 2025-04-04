import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Direction, UserRoles } from '@/entities/user';
import { useCallback, useEffect, useMemo } from 'react';
import { getSelectOptions } from '@/shared/utils/get-select-options';
import { useDepartmentSelectQueries } from '@/shared/api/dictionaries';
import { useCommitteeStaffsDrawer } from '@/shared/hooks/entity-hooks';
import { useTranslatedObject } from '@/shared/lib/hooks/use-translated-enum';
import {
  committeeStaffSchema,
  CreateCommitteeStaffDTO,
  UpdateCommitteeStaffDTO,
  useCommitteeStaffQuery,
  useCreateCommitteeStaff,
  useUpdateCommitteeStaff,
} from '@/entities/admin/committee-staffs';

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

  const userDirectionOptions = useTranslatedObject(Direction, 'direction');

  const departmentOptions = useMemo(
    () => getSelectOptions(departmentSelect || []),
    [departmentSelect],
  );

  const committeeStaffId = useMemo(() => (data?.id ? data?.id : ''), [data]);

  const form = useForm<CreateCommitteeStaffDTO>({
    resolver: zodResolver(committeeStaffSchema),
    defaultValues: DEFAULT_FORM_VALUES,
    mode: 'onChange',
  });

  const { mutateAsync: createCommitteeStaff, isPending: isCreating } =
    useCreateCommitteeStaff();

  const { mutateAsync: updateCommitteeStaff, isPending: isUpdating } =
    useUpdateCommitteeStaff();

  const { data: fetchByIdData, isLoading } =
    useCommitteeStaffQuery(committeeStaffId);

  useEffect(() => {
    if (fetchByIdData && !isCreate) {
      form.reset({
        directions: fetchByIdData.directions,
        fullName: fetchByIdData.fullName,
        pin: fetchByIdData.pin,
        position: fetchByIdData.position,
        role: fetchByIdData.role,
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
          } as UpdateCommitteeStaffDTO);
          if (response.success) {
            handleClose();
            return true;
          }
        }

        return false;
      } catch (error) {
        console.error('[useDistrictForm] Submission error:', error);
        return false;
      }
    },
    [
      isCreate,
      committeeStaffId,
      createCommitteeStaff,
      updateCommitteeStaff,
      handleClose,
      fetchByIdData,
    ],
  );

  const isPending = isCreating || isUpdating;

  return {
    form,
    isCreate,
    isPending,
    fetchByIdData,
    userRoleOptions,
    departmentOptions,
    userDirectionOptions,
    onSubmit: handleSubmit,
    isFetching: isLoading,
  };
}
