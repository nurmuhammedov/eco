import { useTranslation } from 'react-i18next';
import { Form } from '@/shared/components/ui/form';
import { DistrictFormFields } from './district-form-fields';
import { useDistrictForm } from '../model/use-district-form';
import { useDistrictDrawer } from '@/shared/hooks/entity-hooks';
import { BaseDrawer } from '@/shared/components/common/base-drawer';
import FormSkeleton from '@/shared/components/common/form-skeleton/ui';

export const DistrictDrawer = () => {
  const { t } = useTranslation('common');
  const { isOpen, onClose } = useDistrictDrawer();
  const { form, onSubmit, isPending, isCreate, isFetching } = useDistrictForm();

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
            <DistrictFormFields control={form.control} />
          )}
        </div>
      </Form>
    </BaseDrawer>
  );
};
