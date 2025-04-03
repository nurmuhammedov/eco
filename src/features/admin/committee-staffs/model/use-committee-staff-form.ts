import { useForm } from 'react-hook-form';
import { userDirections, userRoles, UserRoles } from '@/entities/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useMemo } from 'react';
import { useCommitteeStaffsDrawer } from '@/shared/hooks/entity-hooks';
import {
  committeeStaffSchema,
  CreateCommitteeStaffDTO,
  UpdateCommitteeStaffDTO,
  useCommitteeStaffQuery,
  useCreateCommitteeStaff,
  useUpdateCommitteeStaff,
} from '@/entities/admin/committee-staffs';
import { useTranslation } from 'react-i18next';

const DEFAULT_FORM_VALUES: CreateCommitteeStaffDTO = {
  pin: '',
  fullName: '',
  position: '',
  directions: [],
  phoneNumber: '',
  departmentId: '',
  role: UserRoles.CHAIRMAN,
};

export function useCommitteeStaffForm() {
  const { t } = useTranslation('common');
  const { data, onClose, isCreate } = useCommitteeStaffsDrawer();

  const userDirectionOptions = userDirections.map(({ label, value }) => ({
    value,
    label: t(`direction.${label}`),
  }));

  const userRoleOptions = userRoles.map(({ id, name }) => ({
    id,
    name: t(`userRoles.${name}`),
  }));

  const committeeStaffId = useMemo(() => (data?.id ? data?.id : 0), [data]);

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
      form.reset(fetchByIdData);
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
    ],
  );

  const isPending = isCreating || isUpdating;

  return {
    form,
    isCreate,
    isPending,
    fetchByIdData,
    userRoleOptions,
    userDirectionOptions,
    onSubmit: handleSubmit,
    isFetching: isLoading,
  };
}
