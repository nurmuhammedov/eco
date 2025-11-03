import { Fragment, useMemo } from 'react';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { useUIActionLabel } from '@/shared/hooks';
import { BaseDrawer } from '@/shared/components/common/base-drawer';
import { useChecklistDrawer } from '@/shared/hooks/entity-hooks';
import { useChecklistForm } from '../model/use-checklist-form';
import { getSelectOptionsByType } from '@/shared/lib/get-select-options';
import FormSkeleton from '@/shared/components/common/form-skeleton/ui';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';

export const ChecklistDrawer = () => {
  const { isOpen, onClose, mode, isCreate } = useChecklistDrawer();
  const modeLabel = useUIActionLabel(mode);
  const { form, onSubmit, isPending, isFetching, categoryTypes } = useChecklistForm();
  const categoryTypeOptions = useMemo(() => getSelectOptionsByType(categoryTypes), [categoryTypes]);

  return (
    <BaseDrawer
      asForm
      open={isOpen}
      onClose={onClose}
      title={modeLabel}
      loading={isPending}
      disabled={isPending}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Form {...form}>
        <div className="space-y-4">
          {isFetching && !isCreate ? (
            <FormSkeleton length={4} />
          ) : (
            <Fragment>
              <FormField
                name="categoryTypeId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tekshiruv turi</FormLabel>
                    <FormControl>
                      <Select {...field} value={field.value?.toString()} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Tekshiruv turini tanlang" />
                        </SelectTrigger>
                        <SelectContent>{categoryTypeOptions}</SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="orderNumber"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Navbat raqami</FormLabel>
                    <FormControl>
                      <Input placeholder="Navbat raqamini kiriting" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="question"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Savol</FormLabel>
                    <FormControl>
                      <Input placeholder="Savol" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="negative"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salbiy matn</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Salbiy matnni kiriting" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="corrective"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chora tadbir rejasi</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Chora tadbir rejasini kiriting" {...field} />
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
