import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { PermitSearchResult } from '@/features/permits/model/types'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAdd } from '@/shared/hooks'
import { useQueryClient } from '@tanstack/react-query'
import { tabs } from '@/features/permits/ui/permit-tabs'
import { InputFile } from '@/shared/components/common/file-upload'
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types'
import FileLink from '@/shared/components/common/file-link'
import { cn } from '@/shared/lib/utils'

interface AddPermitModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const searchSchema = z.object({
  stir: z
    .string({ required_error: 'Majburiy maydon!' })
    .regex(/^\d+$/, { message: 'Faqat raqamlar kiritilishi kerak' })
    .refine((val) => val.length === 9 || val.length === 14, {
      message: 'STIR (JSHSHIR) faqat 9 yoki 14 xonali bo‘lishi kerak',
    }),
  regNumber: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
})

const fileSchema = z.object({
  filePath: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Fayl yuklash majburiy!'),
})

type SearchFormValues = z.infer<typeof searchSchema>
type FileFormValues = z.infer<typeof fileSchema>

export const SearchResultDisplay = ({
  data,
  type = 'modal',
}: {
  data: PermitSearchResult
  type?: 'detail' | 'modal'
}) => {
  const isDetail = type === 'detail'

  const getStatusBadge = (status: string | undefined, isSystemStatus: boolean = false) => {
    if (status === 'ACTIVE') return <span className="font-medium text-green-600">Faol</span>
    if (status === 'EXPIRED') return <span className="font-medium text-red-600">Faol emas</span>
    if (isSystemStatus && status === 'EXPIRING_SOON')
      return <span className="font-medium text-yellow-600">Muddati yaqinlashayotgan</span>
    return <span>-</span>
  }

  const infoRows = [
    { label: 'Ro‘yxat ID raqami', value: data.registerId },
    { label: 'Tashkilot nomi', value: data.name },
    { label: 'STIR', value: data.tin },
    { label: 'JSHSHIR', value: data.pin },
    {
      label: isDetail ? 'Turi' : 'Hujjat turi',
      value: isDetail
        ? tabs.find((t) => t?.key?.toString() == data?.type?.toString())?.label || ''
        : data?.documentType,
    },
    { label: 'Holati', value: getStatusBadge(data.licenseStatus) },
    { label: 'Ro‘yxatga olingan raqami', value: data.registerNumber },
    { label: 'Ro‘yxatga olingan sana', value: data.registrationDate },
    { label: 'Amal qilish muddati', value: data.expiryDate },
    {
      label: 'Tizimdagi amal qilish muddati bo‘yicha holati',
      value: getStatusBadge(data.status, true),
    },
    { label: 'Hujjat nomi', value: data.documentName, fullWidth: true },
    { label: 'Vakolatli tashkilot', value: data.organizationName, fullWidth: true },
    {
      label: 'Faoliyat turi',
      value: data.activityTypes?.length ? data.activityTypes.map((i) => i?.name).join(' | ') : 'Ko‘rsatilmagan',
      fullWidth: true,
    },
    ...(isDetail
      ? [{ label: 'Fayl', value: data?.filePath && <FileLink url={data?.filePath} />, fullWidth: true }]
      : []),
  ]

  return (
    <div className="mt-4 rounded-lg border bg-slate-50/50 p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {infoRows.map((row, idx) => (
          <div key={idx} className={cn('flex flex-col gap-1', row.fullWidth ? 'sm:col-span-2' : '')}>
            <span className="text-xs font-medium text-gray-500">{row.label}</span>
            <div className="text-sm font-medium break-words text-gray-900">{row.value || '-'}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export const AddPermitModal = ({ open, onOpenChange }: AddPermitModalProps) => {
  const [searchResult, setSearchResult] = useState<PermitSearchResult | null>(null)
  const queryClient = useQueryClient()

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: { stir: '', regNumber: '' },
  })

  const fileForm = useForm<FileFormValues>({
    resolver: zodResolver(fileSchema),
    defaultValues: { filePath: '' },
  })

  const { mutateAsync: searchPermit, isPending: isSearchPending } = useAdd<any, any, any>(
    '/integration/iip/individual/license',
    ''
  )
  const { mutateAsync: searchPermitLegal, isPending: isSearchLegalPending } = useAdd<any, any, any>(
    '/integration/iip/legal/license',
    ''
  )

  const { mutateAsync: addPermit, isPending: isAddPending } = useAdd<any, any, any>('/permits/individual')
  const { mutateAsync: addLegalPermit, isPending: isAddLegalPending } = useAdd<any, any, any>('/permits/legal')

  const isAnySearchPending = isSearchPending || isSearchLegalPending
  const isAnyAddPending = isAddPending || isAddLegalPending

  const onSubmit = (values: SearchFormValues) => {
    setSearchResult(null)
    const isLegal = values.stir.length === 9
    const searchFn = isLegal ? searchPermitLegal : searchPermit
    const payload = isLegal
      ? { tin: values.stir, registerNumber: values.regNumber }
      : { pin: values.stir, registerNumber: values.regNumber }

    searchFn(payload).then((res) => {
      if (res?.data) {
        setSearchResult(res.data)
        toast.success('Muvaffaqiyatli topildi!')
      } else {
        toast.error('Ma’lumot topilmadi')
      }
    })
  }

  const handleAdd = async () => {
    const searchValues = form.getValues()
    const fileValid = await fileForm.trigger()

    if (!fileValid) {
      toast.error('Iltimos, faylni yuklang!')
      return
    }

    const { filePath } = fileForm.getValues()
    const isLegal = searchValues.stir.length === 9
    const addFn = isLegal ? addLegalPermit : addPermit
    const payload = isLegal
      ? { tin: searchValues.stir, registerNumber: searchValues.regNumber, filePath }
      : { pin: searchValues.stir, registerNumber: searchValues.regNumber, filePath }

    addFn(payload).then(async () => {
      handleClose()
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['/permits'] }),
        queryClient.invalidateQueries({ queryKey: ['/permits/count'] }),
      ])
      toast.success('Muvaffaqiyatli qo‘shildi')
    })
  }

  const handleClose = () => {
    form.reset()
    fileForm.reset()
    setSearchResult(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[95vh] overflow-y-auto sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Ruxsatnoma qo‘shish</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-end gap-3">
              <FormField
                control={form.control}
                name="stir"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>STIR (JSHSHIR)</FormLabel>
                    <FormControl>
                      <Input placeholder="123456789" {...field} maxLength={14} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <Button type="submit" disabled={isAnySearchPending} className="min-w-[100px]">
                {isAnySearchPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Qidirish'}
              </Button>
            </div>
          </form>
        </Form>

        {searchResult && (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <SearchResultDisplay data={searchResult} />

            <div className="mt-6 border-t pt-4">
              <Form {...fileForm}>
                <form>
                  <FormField
                    name="filePath"
                    control={fileForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Fayl biriktirish</FormLabel>
                        <FormControl>
                          <InputFile
                            uploadEndpoint="/attachments/permits"
                            showPreview={true}
                            form={fileForm}
                            name={field.name}
                            accept={[FileTypes.PDF]}
                            buttonText="Faylni tanlash"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </div>

            <DialogFooter className="mt-6 gap-2 sm:justify-end">
              <Button
                onClick={() => {
                  setSearchResult(null)
                  fileForm.reset()
                }}
                type="button"
                variant="outline"
              >
                Bekor qilish
              </Button>
              <Button
                type="button"
                onClick={handleAdd}
                disabled={isAnyAddPending || searchResult?.status === 'EXPIRED'}
              >
                {isAnyAddPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Qo‘shish
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
