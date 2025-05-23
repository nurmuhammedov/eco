import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useUIActionLabel } from '@/shared/hooks';
import { Input } from '@/shared/components/ui/input';
import { MultiSelect } from '@/shared/components/ui/multi-select';
import { BaseDrawer } from '@/shared/components/common/base-drawer';
import FormSkeleton from '@/shared/components/common/form-skeleton/ui';
import { useTerritorialDepartmentsDrawer } from '@/shared/hooks/entity-hooks';
import { useTerritorialDepartmentsForm } from '../model/use-territorial-departments-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';

export const TerritorialDepartmentsDrawer = () => {
  const { t } = useTranslation('common');
  const { isOpen, onClose, isCreate, mode } = useTerritorialDepartmentsDrawer();
  const { form, onSubmit, isPending, isFetching, regionOptions } = useTerritorialDepartmentsForm();
  const modeState = useUIActionLabel(mode);

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
      <Form {...form}>
        <div className="space-y-4">
          {isFetching && !isCreate ? (
            <FormSkeleton length={2} />
          ) : (
            <Fragment>
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
              <FormField
                name="regionIds"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('region')}</FormLabel>
                    <FormControl>
                      <MultiSelect {...field} options={regionOptions} placeholder={t('select_region')} />
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
