import { Fragment, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { userRoles } from '@/entities/user';
import { Input } from '@/shared/components/ui/input';
import { PhoneInput } from '@/shared/components/ui/phone-input';
import { BaseDrawer } from '@/shared/components/common/base-drawer';
import { getSelectOptions } from '@/shared/utils/get-select-options';
import FormSkeleton from '@/shared/components/common/form-skeleton/ui';
import { useCommitteeStaffsDrawer } from '@/shared/hooks/entity-hooks';
import { useCommitteeStaffForm } from '../model/use-committee-staff-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { MultiSelect } from '@/shared/components/ui/multi-select.tsx';

export const CommitteeStaffDrawer = () => {
  const { t } = useTranslation('common');
  const { isOpen, onClose } = useCommitteeStaffsDrawer();
  const {
    form,
    onSubmit,
    isCreate,
    isPending,
    isFetching,
    departmentOptions,
    userDirectionOptions,
  } = useCommitteeStaffForm();

  const roleOptions = useMemo(
    () => getSelectOptions(userRoles),
    [userRoles, t],
  );

  return (
    <BaseDrawer
      asForm
      open={isOpen}
      onClose={onClose}
      loading={isPending}
      disabled={isPending}
      onSubmit={form.handleSubmit(onSubmit)}
      title={isCreate ? t('actions.add') : t('actions.edit')}
    >
      <Form {...form}>
        <div className="space-y-4">
          {isFetching && !isCreate ? (
            <FormSkeleton length={7} />
          ) : (
            <Fragment>
              <FormField
                name="fullName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>{t('short.full_name')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('short.full_name')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="pin"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>{t('short.pin')}</FormLabel>
                    <FormControl>
                      <Input placeholder="142536945201203" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="position"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>{t('position')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('position')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="phoneNumber"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Telefon raqami</FormLabel>
                    <FormControl>
                      <PhoneInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="role"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('role')}</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        value={field.value}
                        onValueChange={(value) => {
                          if (value) {
                            field.onChange(value);
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('role')} />
                        </SelectTrigger>
                        <SelectContent>{roleOptions}</SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="departmentId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('menu.departments')}</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        value={field.value}
                        onValueChange={(value) => {
                          if (value) {
                            field.onChange(value);
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('menu.departments')} />
                        </SelectTrigger>
                        <SelectContent>{departmentOptions}</SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="directions"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('directions')}</FormLabel>
                    <FormControl>
                      <MultiSelect
                        {...field}
                        maxDisplayItems={5}
                        placeholder={t('directions')}
                        options={userDirectionOptions}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Fragment>
          )}
        </div>
      </Form>
    </BaseDrawer>
  );
};
