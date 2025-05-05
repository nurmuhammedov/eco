import { z } from 'zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/shared/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';

// Forma validatsiya sxemasi
export const craneFormSchema = z.object({
  name: z.string().min(2, "Kamida 2 ta belgi bo'lishi kerak").max(100, "Ko'pi bilan 100 ta belgi bo'lishi kerak"),
});

// Forma ma'lumotlari tipi
export type CraneFormValues = z.infer<typeof craneFormSchema>;

interface CraneFormProps {
  defaultValues?: CraneFormValues;
  onSubmit: (values: CraneFormValues) => void;
  isSubmitting?: boolean;
  mode: 'add' | 'edit';
}

export const CraneForm: React.FC<CraneFormProps> = ({ defaultValues, onSubmit, isSubmitting = false }) => {
  // Form hook
  const form = useForm<CraneFormValues>({
    resolver: zodResolver(craneFormSchema),
    defaultValues: defaultValues || {
      name: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Nomi <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Kranningni nomini kiriting" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saqlanmoqda...' : 'Saqlash'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
