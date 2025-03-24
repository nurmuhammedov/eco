import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect } from 'react';
import { Input } from '@/shared/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegionDrawer } from '@/shared/hooks/entity-hooks';
import { BaseDrawer } from '@/shared/components/common/base-drawer';
import { regionSchema, useRegionQuery } from '@/entities/admin/region';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { UIModeEnum } from '@/shared/types/ui-types';
import {
  useCreateRegion,
  useUpdateRegion,
} from '@/entities/admin/region/region.fetcher';
import {
  CreateRegionDTO,
  RegionFormValues,
  UpdateRegionDTO,
} from '@/entities/admin/region/region.types';

export const RegionDrawer = () => {
  const { t } = useTranslation('common');
  const { isOpen, onClose, mode, data } = useRegionDrawer();
  const { mutateAsync: createRegion, isPending: createPending } =
    useCreateRegion();
  const { mutateAsync: updateRegion, isPending: updatePending } =
    useUpdateRegion();

  const isCreate = mode === UIModeEnum.CREATE;
  const isPending = createPending || updatePending;
  const regionId = data?.id ? Number(data.id) : 0;

  const { data: foundRegion } = useRegionQuery(regionId);

  const form = useForm<RegionFormValues>({
    resolver: zodResolver(regionSchema),
    defaultValues: { name: '', number: 1, soato: 1 },
  });

  useEffect(() => {
    if (foundRegion && !isCreate) form.reset(foundRegion);
  }, [foundRegion, form]);

  const handleClose = (success: boolean) =>
    useCallback(() => {
      if (success) {
        form.reset();
        onClose();
      }
    }, [onClose, form]);

  const onSubmit = useCallback(
    (formData: RegionFormValues) => {
      if (isCreate) {
        return createRegion(formData as CreateRegionDTO).then((response) =>
          handleClose(response.success),
        );
      }

      return updateRegion({
        ...formData,
        id: regionId,
      } as UpdateRegionDTO).then((response) => handleClose(response.success));
    },
    [isCreate, createRegion, updateRegion, regionId, handleClose],
  );

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
                  <Input placeholder={t('soato')} {...field} />
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
                  <Input placeholder={t('number')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Form>
    </BaseDrawer>
  );
};
