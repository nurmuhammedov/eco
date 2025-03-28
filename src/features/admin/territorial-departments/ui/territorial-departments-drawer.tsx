import { useTranslation } from 'react-i18next';
import { Input } from '@/shared/components/ui/input';
import { BaseDrawer } from '@/shared/components/common/base-drawer';
import FormSkeleton from '@/shared/components/common/form-skeleton/ui';
import { useTerritorialDepartmentsDrawer } from '@/shared/hooks/entity-hooks';
import { useTerritorialDepartmentsForm } from '../model/use-territorial-departments-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { MultiSelect } from '@/shared/components/ui/multi-select';
import { Fragment } from 'react';
import { Cat, Dog, Fish, Rabbit, Turtle } from 'lucide-react';

export const TerritorialDepartmentsDrawer = () => {
  const { t } = useTranslation('common');
  const { isOpen, onClose, isCreate } = useTerritorialDepartmentsDrawer();
  const { form, onSubmit, isPending, isFetching } =
    useTerritorialDepartmentsForm();

  const frameworksList = [
    { value: 1, label: 'React', icon: Turtle },
    { value: 2, label: 'Angular', icon: Cat },
    { value: 3, label: 'Vue', icon: Dog },
    { value: 4, label: 'Svelte', icon: Rabbit },
    { value: 5, label: 'Ember', icon: Fish },
    { value: 6, label: 'React native', icon: Fish },
    { value: 7, label: 'Cordova', icon: Fish },
  ];
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
            <Fragment>
              {JSON.stringify(form.formState)}
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
                control={form.control}
                name="regionIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frameworks</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={frameworksList}
                        placeholder="Frameworks tanlang"
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
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
