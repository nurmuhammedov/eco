import { Fragment, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/shared/components/ui/input';
import { useDistrictForm } from '../model/use-district-form';
import { useDistrictDrawer } from '@/shared/hooks/entity-hooks';
import { BaseDrawer } from '@/shared/components/common/base-drawer';
import { getSelectOptions } from '@/shared/lib/get-select-options.tsx';
import FormSkeleton from '@/shared/components/common/form-skeleton/ui';
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

export const DistrictDrawer = () => {
  const { t } = useTranslation('common');
  const { isOpen, onClose } = useDistrictDrawer();
  const { form, onSubmit, isPending, isCreate, isFetching, regions } =
    useDistrictForm();

  const regionOptions = useMemo(() => getSelectOptions(regions), [regions]);

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
            <FormSkeleton length={3} />
          ) : (
            <Fragment>
              <FormField
                name="regionId"
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
                            form.setValue('soato', 0);
                            form.setValue('number', 0);
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
                      <Input
                        placeholder={t('name')}
                        {...field}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="soato"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('soato')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        maxLength={10}
                        placeholder={t('soato')}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="number"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('number')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        maxLength={10}
                        placeholder={t('number')}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
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
