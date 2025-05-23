import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/shared/components/ui/input';
import { useUIActionLabel } from '@/shared/hooks';
import { Textarea } from '@/shared/components/ui/textarea';
import { BaseDrawer } from '@/shared/components/common/base-drawer';
import FormSkeleton from '@/shared/components/common/form-skeleton/ui';
import { useHazardousFacilityTypeDrawer } from '@/shared/hooks/entity-hooks';
import { useHazardousFacilityTypeForm } from '../model/use-hazardous-facility-type-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';

export const HazardousFacilityTypeDrawer = () => {
  const { t } = useTranslation('common');
  const { isOpen, mode, onClose } = useHazardousFacilityTypeDrawer();
  const modeState = useUIActionLabel(mode);
  const { form, onSubmit, isPending, isCreate, isFetching } = useHazardousFacilityTypeForm();

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
                name="description"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('description')}</FormLabel>
                    <FormControl>
                      <Textarea placeholder={t('description')} {...field} />
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
