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
import { zodFormResolver } from '@/shared/lib/zod-form-resolver'
import { useFieldArray, useForm } from 'react-hook-form'
import type { PermitSearchResult } from '@/features/permits/model/types'
import { useState } from 'react'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAdd } from '@/shared/hooks'
import { useQueryClient } from '@tanstack/react-query'
import { SearchResultDisplay } from '@/features/permits/ui/add-permit-modal'
import { format } from 'date-fns'
import DatePicker from '@/shared/components/ui/datepicker'
import { useAuth } from '@/shared/hooks/use-auth'
import { UserRoles } from '@/shared/types/user'
import { useRegionSelectQuery } from '@/shared/api/dictionaries'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { invalidateEndpoint } from '@/shared/lib/query/endpoint-key'
import type { ApiResponse } from '@/shared/types/api'

interface AddPermitTransportModalProps {
  trigger?: string
}

const searchSchema = z.object({
  stir: z
    .string()
    .regex(/^\d+$/)
    .refine((val) => val.length === 0 || val.length === 9 || val.length === 14, {
      message: FORM_ERROR_MESSAGES.invalid,
    })
    .optional()
    .or(z.literal('')),
  regNumber: z.string().min(1),
})

const tankerItemSchema = z.object({
  numberPlate: z.string().min(1),
  model: z.string().min(1),
  factoryNumber: z.string().min(1),
  inventoryNumber: z.string().min(1),
  capacity: z.string().min(1),
  capacityUnit: z.string().min(1),
  regionId: z.string().min(1),
  checkDate: z.date().transform((date) => format(date, 'yyyy-MM-dd')),
  validUntil: z.date().transform((date) => format(date, 'yyyy-MM-dd')),
})

const tankerFormSchema = z.object({
  tankers: z.array(tankerItemSchema).min(1),
})

type SearchFormValues = z.infer<typeof searchSchema>
type TankerFormValues = z.infer<typeof tankerFormSchema>

/** A tanker as it is being filled in: its dates are not picked yet */
type TankerDraft = Omit<z.input<typeof tankerItemSchema>, 'checkDate' | 'validUntil'> & {
  checkDate?: Date
  validUntil?: Date
}

interface TankerFormDraft {
  tankers: TankerDraft[]
}

/** Whose permit it is: an organization by its TIN or a citizen by their PIN */
type PermitOwner = { tin?: string; pin?: string }

type LicenseSearch = PermitOwner & { registerNumber: string }

type TankersPayload = LicenseSearch & { tankers: TankerFormValues['tankers'] }

const EMPTY_TANKER: TankerDraft = {
  numberPlate: '',
  model: '',
  factoryNumber: '',
  inventoryNumber: '',
  capacity: '',
  capacityUnit: '',
  regionId: '',
}

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

  const transportForm = useForm<TankerFormDraft, unknown, TankerFormValues>({
    resolver: zodFormResolver<TankerFormDraft, TankerFormValues>(tankerFormSchema),
    defaultValues: { tankers: [EMPTY_TANKER] },
  })

  const { fields, append, remove } = useFieldArray({
    control: transportForm.control,
    name: 'tankers',
  })

  const { data: regions = [] } = useRegionSelectQuery()

  const { mutate: searchPermit, isPending } = useAdd<LicenseSearch, ApiResponse<PermitSearchResult>>(
    '/integration/iip/individual/license',
    ''
  )
  const { mutate: addPermit, isPending: isAddPermitLoading } = useAdd<TankersPayload>('/tankers/individual', '')
  const { mutate: addLegalPermit, isPending: isAddLegalPermitLoading } = useAdd<TankersPayload>('/tankers/legal', '')
  const { mutate: searchPermitLegal, isPending: isPendingLegal } = useAdd<
    LicenseSearch,
    ApiResponse<PermitSearchResult>
  >('/integration/iip/legal/license', '')

  // Staff name the owner; an organization or a citizen signed in is the owner
  const ownerOf = (stir = ''): { isLegal: boolean; owner: PermitOwner } => {
    if (!isInternalRole) return { isLegal: user?.role === UserRoles.LEGAL, owner: {} }
    const isLegal = stir.length === 9
    return { isLegal, owner: isLegal ? { tin: stir } : { pin: stir } }
  }

  const onSearchSubmit = (values: SearchFormValues) => {
    setSearchResult(null)
    const { isLegal, owner } = ownerOf(values.stir)
    const search = isLegal ? searchPermitLegal : searchPermit

    search(
      { ...owner, registerNumber: values.regNumber },
      {
        onSuccess: (response) => {
          setSearchResult(response.data)
          toast.success('Muvaffaqiyatli topildi!')
        },
      }
    )
  }

  const onSave = ({ tankers }: TankerFormValues) => {
    const { stir, regNumber } = form.getValues()
    const { isLegal, owner } = ownerOf(stir)
    const save = isLegal ? addLegalPermit : addPermit

    save(
      { ...owner, registerNumber: regNumber, tankers },
      {
        onSuccess: () => {
          toast.success('Muvaffaqiyatli saqlandi!')
          handleClose()
          void invalidateEndpoint(queryClient, '/tankers')
        },
      }
    )
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
        <Button className="w-full md:w-auto">{trigger}</Button>
      </DialogTrigger>

      <DialogContent size="xl">
        <DialogHeader>
          <DialogTitle>Transport qo‘shish</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <div className="space-y-4 border-b pb-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-end">
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
                <Button
                  className="w-full md:w-auto"
                  onClick={form.handleSubmit(onSearchSubmit)}
                  disabled={isPending || isPendingLegal}
                >
                  {isPending || isPendingLegal ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Qidirish'}
                </Button>
              ) : (
                <Button className="w-full md:w-auto" variant="destructive" onClick={() => setSearchResult(null)}>
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
                        title="O‘chirish"
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
                          name={`tankers.${index}.regionId`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Viloyat</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="w-full text-xs">
                                    <SelectValue placeholder="Viloyatni tanlang" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {regions.map((region) => (
                                    <SelectItem key={region.id} value={region.id.toString()}>
                                      {region.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={transportForm.control}
                          name={`tankers.${index}.checkDate`}
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel>Texnik ko‘rik sanasi</FormLabel>
                              <DatePicker
                                value={field.value}
                                onChange={field.onChange}
                                disableStrategy="after"
                                placeholder="Sanani tanlang"
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={transportForm.control}
                          name={`tankers.${index}.validUntil`}
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel>Amal qilish muddati</FormLabel>
                              <DatePicker
                                value={field.value}
                                onChange={field.onChange}
                                disableStrategy="before"
                                placeholder="Muddatni tanlang"
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="flex w-full items-center justify-center gap-2 border-2 border-dashed py-6"
                  onClick={() => append(EMPTY_TANKER)}
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

            <DialogFooter className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button className="w-full sm:w-auto" onClick={handleClose} type="button" variant="outline">
                Bekor qilish
              </Button>

              <Button
                className="w-full sm:w-auto"
                type="button"
                onClick={transportForm.handleSubmit(onSave)}
                disabled={isAddPermitLoading || isAddLegalPermitLoading}
              >
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
