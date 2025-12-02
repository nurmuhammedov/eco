import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { PermitSearchResult } from '@/entities/permit';
import { useState } from 'react';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAdd } from '@/shared/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { SearchResultDisplay } from '@/features/permits/ui/add-permit-modal';
import { parseISO } from 'date-fns';
import DatePicker from '@/shared/components/ui/datepicker';

interface AddPermitTransportModalProps {
  trigger?: string;
}

const searchSchema = z.object({
  stir: z
    .string({ required_error: 'Majburiy maydon!' })
    .regex(/^\d+$/, { message: 'Faqat raqamlar kiritilishi kerak' })
    .refine((val) => val.length === 9 || val.length === 14, {
      message: 'STIR (JSHSHIR) faqat 9 yoki 14 xonali bo‘lishi kerak',
    }),
  regNumber: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
});

const tankerItemSchema = z.object({
  numberPlate: z.string({ required_error: 'Majburiy maydon!' }).min(1),
  model: z.string({ required_error: 'Majburiy maydon!' }).min(1),
  factoryNumber: z.string({ required_error: 'Majburiy maydon!' }).min(1),
  inventoryNumber: z.string({ required_error: 'Majburiy maydon!' }).min(1),
  capacity: z.string({ required_error: 'Majburiy maydon!' }).min(1),
  capacityUnit: z.string({ required_error: 'Majburiy maydon!' }).min(1),
  checkDate: z.date({ required_error: 'Majburiy maydon!' }),
  validUntil: z.date({ required_error: 'Majburiy maydon!' }),
});

const tankerFormSchema = z.object({
  tankers: z.array(tankerItemSchema).min(1, 'Kamida bitta transport maʼlumotlari kiritilishi shart!'),
});

type SearchFormValues = z.infer<typeof searchSchema>;
type TankerFormValues = z.infer<typeof tankerFormSchema>;

export const AddPermitTransportModal = ({ trigger = 'Qo‘shish' }: AddPermitTransportModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchResult, setSearchResult] = useState<PermitSearchResult | null>(null);
  const queryClient = useQueryClient();

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: { stir: '', regNumber: '' },
    mode: 'onChange',
  });

  const transportForm = useForm<TankerFormValues>({
    resolver: zodResolver(tankerFormSchema),
    defaultValues: {
      tankers: [
        {
          numberPlate: '',
          model: '',
          factoryNumber: '',
          inventoryNumber: '',
          capacity: '',
          capacityUnit: '',
          checkDate: undefined,
          validUntil: undefined,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: transportForm.control,
    name: 'tankers',
  });

  const { mutateAsync: searchPermit, isPending } = useAdd<any, any, any>('/integration/iip/individual/license', '');
  const { mutateAsync: addPermit, isPending: isAddPermitLoading } = useAdd<any, any, any>('/tankers/individual');
  const { mutateAsync: addLegalPermit, isPending: isAddLegalPermitLoading } = useAdd<any, any, any>('/tankers/legal');
  const { mutateAsync: searchPermitLegal, isPending: isPendingLegal } = useAdd<any, any, any>(
    '/integration/iip/legal/license',
    '',
  );

  const onSearchSubmit = (values: SearchFormValues) => {
    setSearchResult(null);
    const searchFn = values?.stir?.length === 9 ? searchPermitLegal : searchPermit;

    searchFn({
      [values.stir.length === 9 ? 'tin' : 'pin']: values.stir,
      registerNumber: values.regNumber,
    }).then((data) => {
      setSearchResult(data?.data);
      toast.success('Muvaffaqiyatli topildi!');
    });
  };

  const handleSave = async () => {
    const searchValues = form.getValues();
    const isTankerValid = await transportForm.trigger();

    if (!isTankerValid) return;

    const { tankers } = transportForm.getValues();

    const payload = {
      [searchValues.stir.length === 9 ? 'tin' : 'pin']: searchValues.stir,
      registerNumber: searchValues.regNumber,
      tankers,
    };

    const apiFn = searchValues.stir.length === 9 ? addLegalPermit : addPermit;

    apiFn(payload).then(async () => {
      toast.success('Muvaffaqiyatli saqlandi!');
      handleClose();
      await queryClient.invalidateQueries({ queryKey: ['/tankers'] });
      await queryClient.invalidateQueries({ queryKey: ['/tankers/count'] });
    });
  };

  const handleClose = () => {
    form.reset();
    transportForm.reset();
    setSearchResult(null);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>{trigger}</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[1000px] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Transport qo‘shish</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSearchSubmit)} className="space-y-4 border-b pb-4">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="stir"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>STIR (JSHSHIR)</FormLabel>
                      <FormControl>
                        <Input placeholder="123456789" {...field} type="text" maxLength={14} pattern="\d*" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="regNumber"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Ro‘yxatga olingan raqami</FormLabel>
                      <FormControl>
                        <Input placeholder="RA-12345" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={isPending || isPendingLegal}>
                {isPending || isPendingLegal ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Qidirish'}
              </Button>
            </div>
          </form>
        </Form>

        {searchResult && (
          <div className="flex flex-col gap-6">
            <SearchResultDisplay data={searchResult} />

            <div className="text-lg font-semibold flex items-center gap-2 text-primary">Transportlar</div>

            <Form {...transportForm}>
              <form className="space-y-4">
                <div className="flex flex-col gap-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="relative border rounded-lg p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                    >
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={() => remove(index)}
                        title="O'chirish"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>

                      <div className="text-sm font-medium text-muted-foreground mb-3">Transport №{index + 1}</div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* numberPlate */}
                        <FormField
                          control={transportForm.control}
                          name={`tankers.${index}.numberPlate`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Davlat raqami belgisi</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="01 O 001 OO" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* model */}
                        <FormField
                          control={transportForm.control}
                          name={`tankers.${index}.model`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Modeli</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Modeli" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* factoryNumber */}
                        <FormField
                          control={transportForm.control}
                          name={`tankers.${index}.factoryNumber`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Zavod raqami</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Zavod raqami" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* inventoryNumber */}
                        <FormField
                          control={transportForm.control}
                          name={`tankers.${index}.inventoryNumber`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Inventar raqami</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Inventar raqami" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* capacity */}
                        <FormField
                          control={transportForm.control}
                          name={`tankers.${index}.capacity`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Sig‘im</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Sig‘im" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* capacityUnit */}
                        <FormField
                          control={transportForm.control}
                          name={`tankers.${index}.capacityUnit`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">O‘lchov birligi</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Litr, m3, t ..." />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* checkDate */}
                        <FormField
                          control={transportForm.control}
                          name={`tankers.${index}.checkDate`}
                          render={({ field }) => {
                            const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value;
                            return (
                              <FormItem className="w-full">
                                <FormLabel>Texnik ko‘rik sanasi</FormLabel>
                                <DatePicker
                                  value={
                                    dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined
                                  }
                                  onChange={field.onChange}
                                  disableStrategy="after"
                                  placeholder="Sanani tanlang"
                                />
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />

                        {/* validUntil */}
                        <FormField
                          control={transportForm.control}
                          name={`tankers.${index}.validUntil`}
                          render={({ field }) => {
                            const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value;
                            return (
                              <FormItem className="w-full">
                                <FormLabel>Amal qilish muddati</FormLabel>
                                <DatePicker
                                  value={
                                    dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined
                                  }
                                  onChange={field.onChange}
                                  disableStrategy="before"
                                  placeholder="Muddatni tanlang"
                                />
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-dashed border-2 flex gap-2 items-center justify-center py-6"
                  onClick={() =>
                    append({
                      numberPlate: '',
                      model: '',
                      factoryNumber: '',
                      inventoryNumber: '',
                      capacity: '',
                      capacityUnit: '',
                      checkDate: undefined as unknown as Date,
                      validUntil: undefined as unknown as Date,
                    })
                  }
                >
                  <Plus className="w-4 h-4" />
                  Yana transport qo‘shish
                </Button>

                {transportForm.formState.errors.tankers && (
                  <p className="text-sm font-medium text-destructive text-center">
                    {transportForm.formState.errors.tankers.message ||
                      transportForm.formState.errors.tankers.root?.message}
                  </p>
                )}
              </form>
            </Form>

            <DialogFooter className="mt-4 sm:justify-center gap-2">
              <Button onClick={handleClose} type="button" variant="outline">
                Bekor qilish
              </Button>

              <Button type="button" onClick={handleSave} disabled={isAddPermitLoading || isAddLegalPermitLoading}>
                {isAddPermitLoading || isAddLegalPermitLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Saqlash
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
