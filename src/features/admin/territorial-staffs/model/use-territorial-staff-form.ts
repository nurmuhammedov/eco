import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Direction, UserRoles } from '@/entities/user';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslatedObject } from '@/shared/hooks';
import { useOfficeSelectQueries } from '@/shared/api/dictionaries';
import { getSelectOptions } from '@/shared/lib/get-select-options';
import { useTerritorialStaffsDrawer } from '@/shared/hooks/entity-hooks';
import {
  CreateTerritorialStaffDTO,
  territorialStaffSchema,
  UpdateTerritorialStaffDTO,
  useCreateTerritorialStaff,
  useTerritorialStaffQuery,
  useUpdateTerritorialStaff,
} from '@/entities/admin/territorial-staffs';

const DEFAULT_FORM_VALUES: CreateTerritorialStaffDTO = {
  pin: '',
  fullName: '',
  officeId: '',
  position: '',
  directions: [],
  phoneNumber: '',
  role: UserRoles.REGIONAL,
};

export function useTerritorialStaffForm() {
  const { data, onClose, isCreate } = useTerritorialStaffsDrawer();

  const { data: officeSelect } = useOfficeSelectQueries();

  const userRoleOptions = useTranslatedObject(
    {
      [UserRoles.REGIONAL]: UserRoles.REGIONAL,
      [UserRoles.INSPECTOR]: UserRoles.INSPECTOR,
    },
    'userRoles',
  );

  const userPermissionOptions = useTranslatedObject(Direction, 'permission');

  const departmentOptions = useMemo(
    () => getSelectOptions(officeSelect || []),
    [officeSelect],
  );

  const territorialStaffId = useMemo(() => (data?.id ? data?.id : ''), [data]);

  const form = useForm<CreateTerritorialStaffDTO>({
    resolver: zodResolver(territorialStaffSchema),
    defaultValues: DEFAULT_FORM_VALUES,
    mode: 'onChange',
  });

  const { mutateAsync: createTerritorialStaff, isPending: isCreating } =
    useCreateTerritorialStaff();

  const { mutateAsync: updateTerritorialStaff, isPending: isUpdating } =
    useUpdateTerritorialStaff();

  const { data: fetchByIdData, isLoading } =
    useTerritorialStaffQuery(territorialStaffId);

  useEffect(() => {
    if (fetchByIdData && !isCreate) {
      form.reset({
        pin: fetchByIdData.pin,
        role: fetchByIdData.role,
        fullName: fetchByIdData.fullName,
        position: fetchByIdData.position,
        directions: fetchByIdData.directions,
        phoneNumber: fetchByIdData.phoneNumber,
        officeId: String(fetchByIdData.officeId),
      });
    }
  }, [fetchByIdData, isCreate, form]);

  const handleClose = useCallback(() => {
    form.reset(DEFAULT_FORM_VALUES);
    onClose();
  }, [form, onClose]);

  const handleSubmit = useCallback(
    async (formData: CreateTerritorialStaffDTO): Promise<boolean> => {
      try {
        if (isCreate) {
          const response = await createTerritorialStaff(formData);
          if (response.success) {
            handleClose();
            return true;
          }
        } else {
          const response = await updateTerritorialStaff({
            id: territorialStaffId,
            ...formData,
          } as UpdateTerritorialStaffDTO);
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
      territorialStaffId,
      createTerritorialStaff,
      updateTerritorialStaff,
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
    userPermissionOptions,
    onSubmit: handleSubmit,
    isFetching: isLoading,
  };
}
