import { useTranslation } from 'react-i18next';
import { Input } from '@/shared/components/ui/input';
import { BaseDrawer } from '@/shared/components/common/base-drawer';
import FormSkeleton from '@/shared/components/common/form-skeleton/ui';
import { useCentralApparatusDrawer } from '@/shared/hooks/entity-hooks';
import { useCentralApparatusForm } from '../model/use-central-apparatus-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';

export const CentralApparatusDrawer = () => {
  const { t } = useTranslation('common');
  const { isOpen, onClose } = useCentralApparatusDrawer();
  const { form, onSubmit, isPending, isCreate, isFetching } =
    useCentralApparatusForm();

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
            <FormSkeleton length={1} />
          ) : (
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
          )}
        </div>
      </Form>
    </BaseDrawer>
  );
};
