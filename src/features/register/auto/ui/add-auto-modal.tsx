import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { PermitSearchResult } from '@/features/permits/model/types'
import { useState } from 'react'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAdd } from '@/shared/hooks'
import { useQueryClient } from '@tanstack/react-query'
import { SearchResultDisplay } from '@/features/permits/ui/add-permit-modal'
import { format, parseISO } from 'date-fns'
import DatePicker from '@/shared/components/ui/datepicker'
import { useAuth } from '@/shared/hooks/use-auth'
import { UserRoles } from '@/entities/user'

interface AddPermitTransportModalProps {
  trigger?: string
}

const searchSchema = z.object({
  stir: z
    .string()
    .regex(/^\d+$/, { message: 'Faqat raqamlar kiritilishi kerak' })
    .refine((val) => val.length === 0 || val.length === 9 || val.length === 14, {
      message: 'STIR (JSHSHIR) faqat 9 yoki 14 xonali bo‘lishi kerak',
    })
    .optional()
    .or(z.literal('')),
  regNumber: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
})

const tankerItemSchema = z.object({
  numberPlate: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  model: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  factoryNumber: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  inventoryNumber: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  capacity: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  capacityUnit: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  checkDate: z.date({ required_error: 'Majburiy maydon!' }).transform((date) => format(date, 'yyyy-MM-dd')),
  validUntil: z.date({ required_error: 'Majburiy maydon!' }).transform((date) => format(date, 'yyyy-MM-dd')),
})

const tankerFormSchema = z.object({
  tankers: z.array(tankerItemSchema).min(1, 'Kamida bitta transport maʼlumotlari kiritilishi shart!'),
})

type SearchFormValues = z.infer<typeof searchSchema>
type TankerFormValues = z.infer<typeof tankerFormSchema>

export const AddPermitTransportModal = ({
  trigger = 'Harakatlanuvchi sig‘im qo‘shish',
}: AddPermitTransportModalProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchResult, setSearchResult] = useState<PermitSearchResult | null>(null)
  const queryClient = useQueryClient()
  const { user } = useAuth()

  const isInternalRole = user?.role !== UserRoles.LEGAL && user?.role !== UserRoles.INDIVIDUAL

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: { stir: '', regNumber: '' },
    mode: 'onChange',
  })

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
  })

  const { fields, append, remove } = useFieldArray({
    control: transportForm.control,
    name: 'tankers',
  })

  const { mutateAsync: searchPermit, isPending } = useAdd<any, any, any>('/integration/iip/individual/license', '')
  const { mutateAsync: addPermit, isPending: isAddPermitLoading } = useAdd<any, any, any>('/tankers/individual')
  const { mutateAsync: addLegalPermit, isPending: isAddLegalPermitLoading } = useAdd<any, any, any>('/tankers/legal')
  const { mutateAsync: searchPermitLegal, isPending: isPendingLegal } = useAdd<any, any, any>(
    '/integration/iip/legal/license',
    ''
  )

  const onSearchSubmit = (values: SearchFormValues) => {
    setSearchResult(null)

    let searchFn
    const payload: any = { registerNumber: values.regNumber }

    if (isInternalRole) {
      searchFn = (values.stir || '').length === 9 ? searchPermitLegal : searchPermit
      payload[(values.stir || '').length === 9 ? 'tin' : 'pin'] = values.stir
    } else {
      searchFn = user?.role === UserRoles.LEGAL ? searchPermitLegal : searchPermit
    }

    searchFn(payload).then((data: any) => {
      setSearchResult(data?.data)
      toast.success('Muvaffaqiyatli topildi!')
    })
  }

  const handleSave = async () => {
    const searchValues = form.getValues()
    const isTankerValid = await transportForm.trigger()

    if (!isTankerValid) return

    const { tankers } = transportForm.getValues()

    const payload: any = {
      registerNumber: searchValues.regNumber,
      tankers,
    }

    let apiFn

    if (isInternalRole) {
      apiFn = (searchValues.stir || '').length === 9 ? addLegalPermit : addPermit
      payload[(searchValues.stir || '').length === 9 ? 'tin' : 'pin'] = searchValues.stir
    } else {
      apiFn = user?.role === UserRoles.LEGAL ? addLegalPermit : addPermit
    }

    apiFn(payload).then(async () => {
      toast.success('Muvaffaqiyatli saqlandi!')
      handleClose()
      await queryClient.invalidateQueries({ queryKey: ['/tankers'] })
      await queryClient.invalidateQueries({ queryKey: ['/tankers/count'] })
    })
  }

  const handleClose = () => {
    form.reset()
    transportForm.reset()
    setSearchResult(null)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>{trigger}</Button>
      </DialogTrigger>

      <DialogContent className="max-h-[95vh] overflow-y-auto sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Transport qo‘shish</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <div className="space-y-4 border-b pb-4">
            <div className="flex items-end gap-3">
              {isInternalRole && (
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="stir"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Tashkilot STIR/Fuqaro JSHSHIR</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="123456789"
                            {...field}
                            type="text"
                            maxLength={14}
                            pattern="\d*"
                            disabled={!!searchResult}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="regNumber"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Berilgan ruxsatnomaning ro‘yxatga olish raqami</FormLabel>
                      <FormControl>
                        <Input placeholder="RA-12345" {...field} disabled={!!searchResult} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {!searchResult ? (
                <Button onClick={form.handleSubmit(onSearchSubmit)} disabled={isPending || isPendingLegal}>
                  {isPending || isPendingLegal ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Qidirish'}
                </Button>
              ) : (
                <Button variant="destructive" onClick={() => setSearchResult(null)}>
                  O‘chirish
                </Button>
              )}
            </div>
          </div>
        </Form>

        {searchResult && (
          <div className="flex flex-col gap-6">
            <SearchResultDisplay data={searchResult} />

            <div className="text-primary flex items-center gap-2 text-lg font-semibold">Transportlar</div>

            <Form {...transportForm}>
              <form className="space-y-4">
                <div className="flex flex-col gap-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="relative rounded-lg border bg-slate-50/50 p-4 transition-colors hover:bg-slate-50"
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

                      <div className="text-muted-foreground mb-3 text-sm font-medium">Transport №{index + 1}</div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <FormField
                          control={transportForm.control}
                          name={`tankers.${index}.numberPlate`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Davlat raqami belgisi</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder={
                                    isInternalRole
                                      ? form.getValues('stir')?.length === 9
                                        ? '01 001 AAA'
                                        : '01 A 001 AA'
                                      : user?.role === UserRoles.LEGAL
                                        ? '01 001 AAA'
                                        : '01 A 001 AA'
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

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

                        <FormField
                          control={transportForm.control}
                          name={`tankers.${index}.checkDate`}
                          render={({ field }) => {
                            const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
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
                            )
                          }}
                        />

                        <FormField
                          control={transportForm.control}
                          name={`tankers.${index}.validUntil`}
                          render={({ field }) => {
                            const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
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
                            )
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="flex w-full items-center justify-center gap-2 border-2 border-dashed py-6"
                  onClick={() =>
                    append({
                      numberPlate: '',
                      model: '',
                      factoryNumber: '',
                      inventoryNumber: '',
                      capacity: '',
                      capacityUnit: '',
                      checkDate: undefined as unknown as string,
                      validUntil: undefined as unknown as string,
                    })
                  }
                >
                  <Plus className="h-4 w-4" />
                  Yana transport qo‘shish
                </Button>

                {transportForm.formState.errors.tankers && (
                  <p className="text-destructive text-center text-sm font-medium">
                    {transportForm.formState.errors.tankers.message ||
                      transportForm.formState.errors.tankers.root?.message}
                  </p>
                )}
              </form>
            </Form>

            <DialogFooter className="mt-4 gap-2 sm:justify-center">
              <Button onClick={handleClose} type="button" variant="outline">
                Bekor qilish
              </Button>

              <Button type="button" onClick={handleSave} disabled={isAddPermitLoading || isAddLegalPermitLoading}>
                {isAddPermitLoading || isAddLegalPermitLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Saqlash
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
