import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { PermitSearchResult } from '@/entities/permit';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAdd } from '@/shared/hooks';

interface AddPermitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const searchSchema = z.object({
  stir: z
    .string({ required_error: 'Majburiy maydon!' })
    .regex(/^\d+$/, { message: 'Faqat raqamlar kiritilishi kerak' })
    .refine((val) => val.length === 9 || val.length === 14, {
      message: 'STIR (JSHSHIR) faqat 9 yoki 14 xonali bo‘lishi kerak',
    }),
  regNumber: z.string().min(1, 'Majbury maydon!'),
});

type SearchFormValues = z.infer<typeof searchSchema>;

const SearchResultDisplay = ({ data }: { data: PermitSearchResult }) => {
  const infoRows = [
    { label: 'STIR (JSHSHIR)', value: data.stir },
    {
      label: 'Nomi',
      value: data?.organizationName,
    },
    {
      label: 'Holati',
      value: data?.organizationName,
    },
    {
      label: 'Turi',
      value: data?.documentType,
    },
    { label: 'Hujjat ID', value: data?.documentId },
    {
      label: 'Ro‘yxatga olingan raqami',
      value: data?.registrationNumber,
    },
    {
      label: 'Ro‘yxatga olingan sana',
      value: data?.registrationDate,
    },
    {
      label: 'Tugash sanasi',
      value: data?.expiryDate,
    },
    {
      label: 'Hujjat nomi',
      value: data?.documentName,
    },
  ];

  return (
    <div className="mt-4 border rounded-md p-4 bg-muted/30">
      <div className="grid grid-cols-1 gap-y-2">
        {infoRows.map((row) => (
          <div key={row.label} className={'col-span-1 flex flex-row gap-1'}>
            <div className="text-sm font-semibold text-black">{row.label}:</div>
            <div className="text-sm font-medium text-muted-foreground">{row.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AddPermitModal = ({ open, onOpenChange }: AddPermitModalProps) => {
  const [searchResult, setSearchResult] = useState<PermitSearchResult | null>(null);

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      stir: '',
      regNumber: '',
    },
  });

  const { mutateAsync: searchPermit, isPending } = useAdd<any, PermitSearchResult, any>('/permits/search');

  const onSubmit = (values: SearchFormValues) => {
    setSearchResult(null);
    searchPermit(values).then((data) => {
      setSearchResult(data);
      toast.success('Muvaffaqiyatli topildi!');
    });
  };

  const handleAdd = () => {
    console.log(searchResult, 'addResult');
    handleClose();
  };

  const handleClose = () => {
    form.reset();
    setSearchResult(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Qo‘shish</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Qidirish'}
              </Button>
            </div>
          </form>
        </Form>

        {searchResult && (
          <>
            <SearchResultDisplay data={searchResult} />

            <DialogFooter className="mt-4 sm:justify-center">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Bekor qilish
                </Button>
              </DialogClose>
              <Button type="button" onClick={handleAdd} disabled={!searchResult || isPending}>
                Qo‘shish
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
