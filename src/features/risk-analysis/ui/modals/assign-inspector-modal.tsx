// src/features/risk-analysis/ui/modals/assign-inspector-modal.tsx
import { useAssignInspector } from '@/features/risk-analysis/hooks/use-assign-inspector';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import useData from '@/shared/hooks/api/useData';
import useCustomSearchParams from '@/shared/hooks/api/useSearchParams';
import { getSelectOptions } from '@/shared/lib/get-select-options';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const assignInspectorSchema = z.object({
  inspectorId: z.string().min(1, 'Inspektor tanlanishi shart'),
});

type AssignInspectorForm = z.infer<typeof assignInspectorSchema>;

export const AssignInspectorModal: React.FC = () => {
  const { paramsObject, removeParams } = useCustomSearchParams();
  const { data: inspectors, isLoading: inspectorsLoading } = useData<any[]>('/users/office-users/inspectors/select');
  const { mutate, isPending } = useAssignInspector();
  const objectId = paramsObject.objectId;

  const form = useForm<AssignInspectorForm>({
    resolver: zodResolver(assignInspectorSchema),
  });

  const onSubmit = (data: AssignInspectorForm) => {
    if (objectId) {
      mutate(
        {
          inspectorId: data.inspectorId,
          riskAnalysisId: objectId as string,
        },
        {
          onSuccess: () => {
            handleClose();
          },
        },
      );
    }
  };

  const handleClose = () => {
    form.reset();
    removeParams('objectId');
  };

  return (
    <Dialog open={!!objectId} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ijrochini belgilash</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="inspectorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Inspektor</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger disabled={inspectorsLoading}>
                        <SelectValue placeholder="Inspektorni tanlang" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>{getSelectOptions(inspectors || [])}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Bekor qilish
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Saqlanmoqda...' : 'Saqlash'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
