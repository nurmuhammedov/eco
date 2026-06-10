import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { DialogClose } from '@radix-ui/react-dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Textarea } from '@/shared/components/ui/textarea'
import { Input } from '@/shared/components/ui/input'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { useExecuteInitial } from '@/features/inquiries/hooks/use-inquiry-mutations'
import {
  InquiryAction,
  inquiryActionLabels,
  InquiryBelongType,
  inquiryBelongTypeLabels,
} from '@/features/inquiries/model/types'
import { InputFile } from '@/shared/components/common/file-upload'
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types'
import { ApplicationModal } from '@/features/application/create-application'
import { useEimzo } from '@/shared/hooks/use-eimzo'
import { apiClient } from '@/shared/api/api-client'
import { useQuery } from '@tanstack/react-query'

const schema = z
  .object({
    type: z.enum(['APPEAL', 'VIOLATION_REPORT', 'SUGGESTION']).optional(),
    action: z
      .enum([InquiryAction.SEND_TO_COURT, InquiryAction.REJECT, InquiryAction.REDIRECT, InquiryAction.COMPLETE])
      .optional(),
    initialExecutionFilePath: z.string().optional(),
    message: z.string().optional(),
    tin: z.string().optional(),
    belongType: z.enum(['HF', 'EQUIPMENT', 'IRS', 'XRAY']).optional(),
    belongId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'VIOLATION_REPORT') {
      if (!data.belongType)
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: FORM_ERROR_MESSAGES.required, path: ['belongType'] })
      if (!data.belongId)
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: FORM_ERROR_MESSAGES.required, path: ['belongId'] })
      if (!data.tin) ctx.addIssue({ code: z.ZodIssueCode.custom, message: FORM_ERROR_MESSAGES.required, path: ['tin'] })
    } else {
      if (!data.action)
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: FORM_ERROR_MESSAGES.required, path: ['action'] })
      if (!data.initialExecutionFilePath)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: FORM_ERROR_MESSAGES.required,
          path: ['initialExecutionFilePath'],
        })
    }
  })

const useFetchBelongs = (type: string | undefined, tin: string | undefined, enabled: boolean) => {
  return useQuery({
    queryKey: ['belongs', type, tin],
    queryFn: async () => {
      if (!tin || !type) return []
      let url = ''
      switch (type) {
        case 'HF':
          url = `/hf/by-tin/select?legalTin=${tin}`
          break
        case 'IRS':
          url = `/irs/by-tin/select?legalTin=${tin}`
          break
        case 'XRAY':
          url = `/xrays/by-tin/select?legalTin=${tin}`
          break
        case 'EQUIPMENT':
          url = `/equipments/by-tin/select?legalTin=${tin}`
          break
        default:
          return []
      }
      const { data } = await apiClient.get<any>(url)
      return data?.data || []
    },
    enabled: enabled && !!tin && !!type && (tin.length === 9 || tin.length === 14),
  })
}

interface Props {
  inquiryType?: string
}

const ExecuteInitialModal = ({ inquiryType }: Props) => {
  const { id } = useParams()
  const [isShow, setIsShow] = useState(false)
  const { mutateAsync, isPending } = useExecuteInitial()

  const [searchTin, setSearchTin] = useState('')

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: inquiryType as any,
      tin: '',
    },
  })

  const typeValue = form.watch('type') || inquiryType
  const tinValue = form.watch('tin')
  const belongTypeValue = form.watch('belongType')

  const { data: belongOptions, isLoading: isBelongsLoading } = useFetchBelongs(belongTypeValue, searchTin, isShow)

  useEffect(() => {
    form.setValue('belongId', undefined as any, { shouldValidate: typeValue === 'VIOLATION_REPORT' })
    setSearchTin('')
  }, [tinValue, belongTypeValue, form, typeValue])

  const handleSearch = () => {
    if (tinValue && (tinValue.length === 9 || tinValue.length === 14)) {
      setSearchTin(tinValue)
    }
  }

  const {
    error,
    isLoading: isEimzoLoading,
    documentUrl,
    isModalOpen,
    isPdfLoading,
    handleCloseModal,
    handleCreateApplication,
    submitApplicationMetaData,
  } = useEimzo({
    pdfEndpoint: `/inquiries/${id}/generate-pdf`,
    submitEndpoint: `/inquiries/${id}/set-belonging`,
    queryKey: '/inquiries',
    onEnd: () => {
      setIsShow(false)
      form.reset()
    },
  })

  function onSubmit(data: z.infer<typeof schema>) {
    if (!id) return
    if (typeValue === 'VIOLATION_REPORT') {
      handleCreateApplication({ belongType: data.belongType, belongId: data.belongId })
    } else {
      mutateAsync({
        id,
        data: {
          type: data.type,
          action: data.action,
          initialExecutionFilePath: data.initialExecutionFilePath,
          message: data.message,
        },
      }).then(() => {
        setIsShow(false)
        form.reset()
      })
    }
  }

  const isLoading = isPending || isEimzoLoading

  return (
    <>
      <Dialog onOpenChange={setIsShow} open={isShow}>
        <DialogTrigger asChild>
          <Button>Ijro etish</Button>
        </DialogTrigger>
        <DialogContent className="max-h-[95vh] overflow-y-auto sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle className="text-[#4E75FF]">Ijro etish</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Murojaat turi</FormLabel>
                    <Select
                      onValueChange={(val) => {
                        field.onChange(val)
                        form.setValue('action', undefined as any, { shouldValidate: true })
                      }}
                      value={field.value || inquiryType}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Turini tanlang" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="APPEAL">Murojaat</SelectItem>
                        <SelectItem value="VIOLATION_REPORT">Huquqbuzarliik xabari</SelectItem>
                        <SelectItem value="SUGGESTION">Taklif</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {typeValue === 'VIOLATION_REPORT' ? (
                <div className="space-y-4 rounded-lg border bg-blue-50/30 p-4">
                  <FormField
                    control={form.control}
                    name="belongType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Obyekt turini tanlang</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Turini tanlang" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(InquiryBelongType).map((bt) => (
                              <SelectItem key={bt} value={bt}>
                                {inquiryBelongTypeLabels[bt] || bt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Tashkilot STIR</FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input placeholder="STIR kiriting" {...field} maxLength={14} className="bg-white" />
                          </FormControl>
                          <Button type="button" onClick={handleSearch} disabled={isBelongsLoading || !belongTypeValue}>
                            {isBelongsLoading ? 'Qidirish...' : 'Qidirish'}
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="belongId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Obyektni tanlang</FormLabel>
                        <Select
                          disabled={!(belongOptions && belongOptions.length > 0)}
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Obyektni tanlang" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {belongOptions?.map((item: any) => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.name || item.brandName || item.model || item.id}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ) : (
                <>
                  <FormField
                    control={form.control}
                    name="action"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Ijro harakati</FormLabel>
                        <Select
                          key={`action-${typeValue}-${field.value || 'empty'}`}
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Ijro harakatini tanlang" />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {Object.values(InquiryAction)
                              .filter((action) => {
                                if (typeValue !== 'VIOLATION_REPORT' && action === InquiryAction.SEND_TO_COURT) {
                                  return false
                                }
                                return true
                              })
                              .map((action) => (
                                <SelectItem key={action} value={action}>
                                  {inquiryActionLabels[action] || action}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <FormLabel required>
                      {form.watch('action') === InquiryAction.SEND_TO_COURT
                        ? 'Sudga tayyorlangan hujjat'
                        : 'Asos hujjat'}
                    </FormLabel>
                    <InputFile
                      name="initialExecutionFilePath"
                      form={form}
                      uploadEndpoint="/public/attachments/inquiries"
                      accept={[FileTypes.IMAGE, FileTypes.PDF, FileTypes.DOC]}
                      multiple={false}
                      buttonText="Hujjatni yuklang"
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Izoh</FormLabel>
                        <FormControl>
                          <Textarea
                            className="resize-none"
                            rows={5}
                            placeholder="Izoh yozing..."
                            {...field}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <DialogClose asChild>
                  <Button disabled={isLoading} variant="outline" type="button">
                    Bekor qilish
                  </Button>
                </DialogClose>
                <Button disabled={isLoading} type="submit" loading={isLoading}>
                  Saqlash
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <ApplicationModal
        error={error}
        isOpen={isModalOpen}
        isLoading={isEimzoLoading}
        documentUrl={documentUrl || ''}
        isPdfLoading={isPdfLoading}
        onClose={() => {
          handleCloseModal()
          setIsShow(true)
        }}
        submitApplicationMetaData={submitApplicationMetaData}
        showSignature={true}
      />
    </>
  )
}

export default ExecuteInitialModal
