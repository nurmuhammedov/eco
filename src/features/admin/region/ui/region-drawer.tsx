import { useTranslation } from 'react-i18next';
import { Form } from '@/shared/components/ui/form';
import { RegionFormFields } from './region-form-fields';
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
      disabled={isPending}
      onSubmit={form.handleSubmit(onSubmit)}
      title={isCreate ? t('actions.add') : t('actions.edit')}
    >
      <Form {...form}>
        <div className="space-y-4">
          {isFetching && !isCreate ? (
            <FormSkeleton length={3} />
          ) : (
            <RegionFormFields control={form.control} />
          )}
        </div>
      </Form>
    </BaseDrawer>
  );
};
