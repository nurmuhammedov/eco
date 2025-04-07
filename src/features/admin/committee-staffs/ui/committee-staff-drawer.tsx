import { Fragment, useMemo } from 'react';
import { UIModeEnum } from '@/shared/types';
import { useTranslation } from 'react-i18next';
import { Input } from '@/shared/components/ui/input';
import { CommitteeStaffView } from './committee-staff-view';
import { PhoneInput } from '@/shared/components/ui/phone-input';
import { MultiSelect } from '@/shared/components/ui/multi-select';
import { BaseDrawer } from '@/shared/components/common/base-drawer';
import { getSelectOptions } from '@/shared/lib/get-select-options.tsx';
import FormSkeleton from '@/shared/components/common/form-skeleton/ui';
import { useCommitteeStaffsDrawer } from '@/shared/hooks/entity-hooks';
import { useUIActionLabel } from '@/shared/lib/hooks/use-ui-action-label';
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
import { InputNumber } from '@/shared/components/ui/input-number.tsx';

export const CommitteeStaffDrawer = () => {
  const { t } = useTranslation('common');
  const { isOpen, mode, onClose } = useCommitteeStaffsDrawer();
  const modeState = useUIActionLabel(mode);
  const {
    form,
    onSubmit,
    isCreate,
    isPending,
    isFetching,
    fetchByIdData,
    userRoleOptions,
    departmentOptions,
    userDirectionOptions,
  } = useCommitteeStaffForm();

  const roleOptions = useMemo(() => getSelectOptions(userRoleOptions), []);

  return (
    <BaseDrawer
      asForm
      open={isOpen}
      title={modeState}
      onClose={onClose}
      loading={isPending}
      disabled={isPending}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      {mode === UIModeEnum.VIEW ? (
        <CommitteeStaffView data={fetchByIdData as any} />
      ) : (
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
                        <InputNumber
                          maxLength={14}
                          placeholder="142536945201203"
                          {...field}
                        />
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
                      <FormLabel required>{t('role')}</FormLabel>
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
                      <FormLabel required>{t('menu.departments')}</FormLabel>
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
                      <FormLabel required>{t('directions')}</FormLabel>
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
      )}
    </BaseDrawer>
  );
};
