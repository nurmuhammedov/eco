import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { DialogClose } from '@radix-ui/react-dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Textarea } from '@/shared/components/ui/textarea'
import { Input } from '@/shared/components/ui/input'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { useExecuteInitial } from '@/features/inquiries/hooks/use-inquiry-mutations'
import {
  appealTypeTranslations,
  InquiryAction,
  inquiryActionLabels,
  InquiryBelongType,
  inquiryBelongTypeLabels,
} from '@/features/inquiries/model/types'
import { InputFile } from '@/shared/components/common/file-upload'
import { FileTypes } from '@/shared/components/common/file-upload/model/file-types'
import { ApplicationModal } from '@/features/application/create-application'
import { useEimzo } from '@/shared/hooks/use-eimzo'
import { apiClient } from '@/shared/api/api-client'
import { useQuery } from '@tanstack/react-query'
import { endpointKey } from '@/shared/lib/query/endpoint-key'
import type { ApiResponse } from '@/shared/types/api'
import type { OptionItem } from '@/shared/types/general'
import type { InquiryType } from '@/features/inquiries/model/types'

/** The registry objects a violation report can be tied to: OTHER has nothing to pick */
const BELONG_TYPES = [
  InquiryBelongType.HF,
  InquiryBelongType.EQUIPMENT,
  InquiryBelongType.IRS,
  InquiryBelongType.XRAY,
] as const

type BelongType = (typeof BELONG_TYPES)[number]

/** Only a violation report goes to court, and this form ties one to its object instead */
const EXECUTION_ACTIONS = Object.values(InquiryAction).filter((action) => action !== InquiryAction.SEND_TO_COURT)

const schema = z
  .object({
    type: z.enum(['APPEAL', 'VIOLATION_REPORT', 'SUGGESTION']).optional(),
    action: z.nativeEnum(InquiryAction).optional(),
    initialExecutionFilePath: z.string().optional(),
    message: z.string().optional(),
    tin: z.string().optional(),
    belongType: z.enum(BELONG_TYPES).optional(),
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

const BELONG_SELECT_ENDPOINTS: Record<BelongType, string> = {
  [InquiryBelongType.HF]: '/hf/by-tin/select',
  [InquiryBelongType.IRS]: '/irs/by-tin/select',
  [InquiryBelongType.XRAY]: '/xrays/by-tin/select',
  [InquiryBelongType.EQUIPMENT]: '/equipments/by-tin/select',
}

/** A registry object as its select list names it */
type BelongOption = OptionItem<string> & { brandName?: string | null; model?: string | null }

const useFetchBelongs = (type: BelongType | undefined, tin: string, enabled: boolean) => {
  const endpoint = type ? BELONG_SELECT_ENDPOINTS[type] : ''
  return useQuery({
    queryKey: endpointKey(endpoint, { legalTin: tin }),
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<BelongOption[]>>(endpoint, { legalTin: tin })
      return data.data ?? []
    },
    enabled: enabled && !!type && (tin.length === 9 || tin.length === 14),
  })
}

interface Props {
  inquiryType?: InquiryType | null
}

const ExecuteInitialModal = ({ inquiryType }: Props) => {
  const { id } = useParams()
  const [isShow, setIsShow] = useState(false)
  const { mutate, isPending } = useExecuteInitial()

  const [searchTin, setSearchTin] = useState('')

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: inquiryType ?? undefined,
      tin: '',
    },
  })

  const typeValue = form.watch('type') || inquiryType
  const tinValue = form.watch('tin')
  const belongTypeValue = form.watch('belongType')

  const { data: belongOptions, isLoading: isBelongsLoading } = useFetchBelongs(belongTypeValue, searchTin, isShow)

  useEffect(() => {
    form.resetField('belongId')
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
    invalidates: '/inquiries',
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
      mutate(
        {
          id,
          data: {
            type: data.type,
            action: data.action,
            initialExecutionFilePath: data.initialExecutionFilePath,
            message: data.message,
          },
        },
        {
          onSuccess: () => {
            setIsShow(false)
            form.reset()
          },
        }
      )
    }
  }

  const isLoading = isPending || isEimzoLoading

  return (
    <>
      <Dialog onOpenChange={setIsShow} open={isShow}>
        <DialogTrigger asChild>
          <Button>Ijro etish</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-blue-400">Ijro etish</DialogTitle>
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
                        form.resetField('action')
                      }}
                      value={field.value ?? inquiryType ?? undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Turini tanlang" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(appealTypeTranslations).map(([type, label]) => (
                          <SelectItem key={type} value={type}>
                            {label}
                          </SelectItem>
                        ))}
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
                            {BELONG_TYPES.map((belongType) => (
                              <SelectItem key={belongType} value={belongType}>
                                {inquiryBelongTypeLabels[belongType]}
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
                            {belongOptions?.map((item) => (
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
                            {EXECUTION_ACTIONS.map((action) => (
                              <SelectItem key={action} value={action}>
                                {inquiryActionLabels[action]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-1">
                    <FormLabel required>Asos hujjat</FormLabel>
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

              <DialogFooter>
                <DialogClose asChild>
                  <Button disabled={isLoading} variant="outline" type="button">
                    Bekor qilish
                  </Button>
                </DialogClose>
                <Button disabled={isLoading} type="submit" loading={isLoading}>
                  Saqlash
                </Button>
              </DialogFooter>
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
