import { Fragment, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/shared/components/ui/input';
import { useUIActionLabel } from '@/shared/hooks';
import { useEquipmentForm } from '../model/use-equipment-form.ts';
import { useEquipmentDrawer } from '@/shared/hooks/entity-hooks';
import { getSelectOptions } from '@/shared/lib/get-select-options';
import { BaseDrawer } from '@/shared/components/common/base-drawer';
import FormSkeleton from '@/shared/components/common/form-skeleton/ui';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';

export const EquipmentDrawer = () => {
  const { t } = useTranslation('common');
  const { isOpen, onClose, mode, isCreate } = useEquipmentDrawer();
  const modeState = useUIActionLabel(mode);
  const { form, onSubmit, isPending, isFetching } = useEquipmentForm();

  const regionOptions = useMemo(() => getSelectOptions([]), []);

  return (
    <BaseDrawer
      asForm
      open={isOpen}
      onClose={onClose}
      title={modeState}
      loading={isPending}
      disabled={isPending}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Form {...form}>
        <div className="space-y-4">
          {isFetching && !isCreate ? (
            <FormSkeleton length={2} />
          ) : (
            <Fragment>
              <FormField
                name="equipmentType"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('region')}</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        value={field.value}
                        onValueChange={(value) => {
                          if (value) {
                            field.onChange(value);
                            form.setValue('name', '');
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('select_region')} />
                        </SelectTrigger>
                        <SelectContent>{regionOptions}</SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('name')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('name')} {...field} />
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
