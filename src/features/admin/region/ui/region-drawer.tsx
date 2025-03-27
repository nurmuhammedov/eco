import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/shared/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { useRegionForm } from '../model/use-region-form';
import { useRegionDrawer } from '@/shared/hooks/entity-hooks';
import { BaseDrawer } from '@/shared/components/common/base-drawer';
import FormSkeleton from '@/shared/components/common/form-skeleton/ui';

export const RegionDrawer = () => {
  const { t } = useTranslation('common');
  const { isOpen, onClose } = useRegionDrawer();
  const { form, onSubmit, isPending, isCreate, isFetching } = useRegionForm();

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
                name="soato"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('soato')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
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
