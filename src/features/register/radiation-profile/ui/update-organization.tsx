import { FC, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useData, useUpdate } from '@/shared/hooks'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { GoBack } from '@/shared/components/common'
import { DetailCardAccordion } from '@/shared/components/common/detail-card'
import LegalApplicantInfo from '@/features/application/application-detail/ui/parts/legal-applicant-info.tsx'
import { CardForm } from '@/entities/create-application'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { InputFile } from '@/shared/components/common/file-upload'
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types.ts'
import DatePicker from '@/shared/components/ui/datepicker'
import { parseISO, format } from 'date-fns'
import { Button } from '@/shared/components/ui/button'
import { checkExpiryDate } from '@/shared/lib/zod-helpers'

const fileDateSchema = z
  .union([z.string(), z.date()])
  .optional()
  .nullable()
  .transform((val) => (val ? format(new Date(val), 'yyyy-MM-dd') : null))

const updateSchema = z
  .object({
    file1Path: z.string().optional().nullable(),
    file1ExpiryDate: fileDateSchema,
    file2Path: z.string().optional().nullable(),
    file2ExpiryDate: fileDateSchema,
    file5Path: z.string().optional().nullable(),
    file5ExpiryDate: fileDateSchema,
    file7Path: z.string().optional().nullable(),
    file7ExpiryDate: fileDateSchema,
    file9Path: z.string().optional().nullable(),
    file9ExpiryDate: fileDateSchema,
    file15Path: z.string().optional().nullable(),
    file15ExpiryDate: fileDateSchema,
  })
  .superRefine((data: any, ctx: any) => checkExpiryDate(data, ctx, 'file1Path', 'file1ExpiryDate'))
  .superRefine((data: any, ctx: any) => checkExpiryDate(data, ctx, 'file2Path', 'file2ExpiryDate'))
  .superRefine((data: any, ctx: any) => checkExpiryDate(data, ctx, 'file5Path', 'file5ExpiryDate'))
  .superRefine((data: any, ctx: any) => checkExpiryDate(data, ctx, 'file7Path', 'file7ExpiryDate'))
  .superRefine((data: any, ctx: any) => checkExpiryDate(data, ctx, 'file9Path', 'file9ExpiryDate'))
  .superRefine((data: any, ctx: any) => checkExpiryDate(data, ctx, 'file15Path', 'file15ExpiryDate'))

export const UpdateOrganization: FC = () => {
  const { id, type } = useParams<{ id: string; type: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading } = useData<any>(`/radiation-profiles/${id}`)

  const form = useForm<z.infer<typeof updateSchema>>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      file1Path: '',
      file1ExpiryDate: undefined,
      file2Path: '',
      file2ExpiryDate: undefined,
      file5Path: '',
      file5ExpiryDate: undefined,
      file7Path: '',
      file7ExpiryDate: undefined,
      file9Path: '',
      file9ExpiryDate: undefined,
      file15Path: '',
      file15ExpiryDate: undefined,
    },
  })

  const { mutate, isPending } = useUpdate(`/radiation-profiles`, id, 'put')

  useEffect(() => {
    if (data?.files) {
      form.reset({
        file1Path: data.files.file1Path?.path || '',
        file1ExpiryDate: data.files.file1Path?.expiryDate || undefined,
        file2Path: data.files.file2Path?.path || '',
        file2ExpiryDate: data.files.file2Path?.expiryDate || undefined,
        file5Path: data.files.file5Path?.path || '',
        file5ExpiryDate: data.files.file5Path?.expiryDate || undefined,
        file7Path: data.files.file7Path?.path || '',
        file7ExpiryDate: data.files.file7Path?.expiryDate || undefined,
        file9Path: data.files.file9Path?.path || '',
        file9ExpiryDate: data.files.file9Path?.expiryDate || undefined,
        file15Path: data.files.file15Path?.path || '',
        file15ExpiryDate: data.files.file15Path?.expiryDate || undefined,
      })
    }
  }, [data, form])

  const onSubmit = (values: z.infer<typeof updateSchema>) => {
    const isIrs = type === 'IRS'
    const isXray = type === 'XRAY'

    const formatValue = (val: any) => (val === '' || val === null || val === undefined ? null : val)

    let payload: any = {}

    if (isIrs) {
      payload = {
        file1Path: formatValue(values.file1Path),
        file1ExpiryDate: formatValue(values.file1ExpiryDate),
        file2Path: formatValue(values.file2Path),
        file2ExpiryDate: formatValue(values.file2ExpiryDate),
        file5Path: formatValue(values.file5Path),
        file5ExpiryDate: formatValue(values.file5ExpiryDate),
        file15Path: formatValue(values.file15Path),
        file15ExpiryDate: formatValue(values.file15ExpiryDate),
      }
    } else if (isXray) {
      payload = {
        file5Path: formatValue(values.file5Path),
        file5ExpiryDate: formatValue(values.file5ExpiryDate),
        file7Path: formatValue(values.file7Path),
        file7ExpiryDate: formatValue(values.file7ExpiryDate),
        file9Path: formatValue(values.file9Path),
        file9ExpiryDate: formatValue(values.file9ExpiryDate),
      }
    }

    payload.type = type || 'IRS'

    mutate(payload, {
      onSuccess: () => {
        toast.success('So‘rov masʼul xodimga yuborildi. O‘zgarishlar tasdiqlangandan so‘ng ko‘rinadi!')
        queryClient.invalidateQueries({ queryKey: ['radiation-profiles'] })
        queryClient.invalidateQueries({ queryKey: [`/radiation-profiles/${id}`] })
        navigate(-1)
      },
      onError: () => {
        toast.error('Xatolik yuz berdi!')
      },
    })
  }

  if (isLoading) return null

  const isIrs = type === 'IRS'
  const isXray = type === 'XRAY'

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <GoBack title={`Tashkilot ma’lumotlarini tahrirlash`} />
      </div>

      <DetailCardAccordion defaultValue={['applicant_info']}>
        <DetailCardAccordion.Item value="applicant_info" title="Tashkilot to‘g‘risida ma’lumot">
          <LegalApplicantInfo showUpdateButton={false} tinNumber={data?.legalTin} />
        </DetailCardAccordion.Item>
      </DetailCardAccordion>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <CardForm>
            <div className="grid gap-x-4 gap-y-4 md:grid-cols-2">
              {isIrs && (
                <>
                  <div className="border-b pb-4">
                    <FormField
                      name="file1Path"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="mb-2">
                          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                            <FormLabel>Mehnat vazirligi tomonidan berilgan ekspertiza xulosasi</FormLabel>
                            <FormControl>
                              <InputFile
                                form={form}
                                name={field.name}
                                accept={[FileTypes.PDF]}
                                onRemove={() =>
                                  form.setValue('file1ExpiryDate', undefined as any, { shouldValidate: true })
                                }
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="file1ExpiryDate"
                      render={({ field }) => {
                        const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
                        return (
                          <FormItem className="w-full">
                            <div className="mb-2 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                              <FormLabel required={!!form.watch('file1Path')}>Amal qilish muddati</FormLabel>
                              <DatePicker
                                disableStrategy="before"
                                className={'w-full sm:max-w-[65%]'}
                                value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                                onChange={field.onChange}
                                placeholder="Amal qilish muddati"
                                disabled={!form.watch('file1Path')}
                              />
                            </div>
                            <FormMessage />
                          </FormItem>
                        )
                      }}
                    />
                  </div>

                  <div className="border-b pb-4">
                    <FormField
                      name="file2Path"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="mb-2">
                          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                            <FormLabel>Sanitariya-epidemiologik xulosasi</FormLabel>
                            <FormControl>
                              <InputFile
                                form={form}
                                name={field.name}
                                accept={[FileTypes.PDF]}
                                onRemove={() =>
                                  form.setValue('file2ExpiryDate', undefined as any, { shouldValidate: true })
                                }
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="file2ExpiryDate"
                      render={({ field }) => {
                        const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
                        return (
                          <FormItem className="w-full">
                            <div className="mb-2 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                              <FormLabel required={!!form.watch('file2Path')}>Amal qilish muddati</FormLabel>
                              <DatePicker
                                disableStrategy="before"
                                className={'w-full sm:max-w-[65%]'}
                                value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                                onChange={field.onChange}
                                placeholder="Amal qilish muddati"
                                disabled={!form.watch('file2Path')}
                              />
                            </div>
                            <FormMessage />
                          </FormItem>
                        )
                      }}
                    />
                  </div>
                </>
              )}

              <div className="border-b pb-4">
                <FormField
                  name="file5Path"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="mb-2">
                      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                        <FormLabel>Radiatsiyaviy xavfsizlik bo‘yicha o‘qiganlik yuzasidan sertifikat</FormLabel>
                        <FormControl>
                          <InputFile
                            form={form}
                            name={field.name}
                            accept={[FileTypes.PDF]}
                            onRemove={() =>
                              form.setValue('file5ExpiryDate', undefined as any, { shouldValidate: true })
                            }
                          />
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="file5ExpiryDate"
                  render={({ field }) => {
                    const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
                    return (
                      <FormItem className="w-full">
                        <div className="mb-2 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                          <FormLabel required={!!form.watch('file5Path')}>Amal qilish muddati</FormLabel>
                          <DatePicker
                            disableStrategy="before"
                            className={'w-full sm:max-w-[65%]'}
                            value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                            onChange={field.onChange}
                            placeholder="Amal qilish muddati"
                            disabled={!form.watch('file5Path')}
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )
                  }}
                />
              </div>

              {isXray && (
                <>
                  <div className="border-b pb-4">
                    <FormField
                      name="file7Path"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="mb-2">
                          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                            <FormLabel>Dozimetr protokoli (bayonnomasi)</FormLabel>
                            <FormControl>
                              <InputFile
                                form={form}
                                name={field.name}
                                accept={[FileTypes.PDF]}
                                onRemove={() =>
                                  form.setValue('file7ExpiryDate', undefined as any, { shouldValidate: true })
                                }
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="file7ExpiryDate"
                      render={({ field }) => {
                        const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
                        return (
                          <FormItem className="w-full">
                            <div className="mb-2 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                              <FormLabel required={!!form.watch('file7Path')}>Amal qilish muddati</FormLabel>
                              <DatePicker
                                disableStrategy="before"
                                className={'w-full sm:max-w-[65%]'}
                                value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                                onChange={field.onChange}
                                placeholder="Amal qilish muddati"
                                disabled={!form.watch('file7Path')}
                              />
                            </div>
                            <FormMessage />
                          </FormItem>
                        )
                      }}
                    />
                  </div>

                  <div className="border-b pb-4">
                    <FormField
                      name="file9Path"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="mb-2">
                          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                            <FormLabel>Yerga ulash va ventilatsiya dalolatnomasi</FormLabel>
                            <FormControl>
                              <InputFile
                                form={form}
                                name={field.name}
                                accept={[FileTypes.PDF]}
                                onRemove={() =>
                                  form.setValue('file9ExpiryDate', undefined as any, { shouldValidate: true })
                                }
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="file9ExpiryDate"
                      render={({ field }) => {
                        const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
                        return (
                          <FormItem className="w-full">
                            <div className="mb-2 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                              <FormLabel required={!!form.watch('file9Path')}>Amal qilish muddati</FormLabel>
                              <DatePicker
                                disableStrategy="before"
                                className={'w-full sm:max-w-[65%]'}
                                value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                                onChange={field.onChange}
                                placeholder="Amal qilish muddati"
                                disabled={!form.watch('file9Path')}
                              />
                            </div>
                            <FormMessage />
                          </FormItem>
                        )
                      }}
                    />
                  </div>
                </>
              )}

              {isIrs && (
                <div className="border-b pb-4">
                  <FormField
                    name="file15Path"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="mb-2">
                        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                          <FormLabel>Tibbiy ko‘rikdan o‘tkazilganligi</FormLabel>
                          <FormControl>
                            <InputFile
                              form={form}
                              name={field.name}
                              accept={[FileTypes.PDF]}
                              onRemove={() =>
                                form.setValue('file15ExpiryDate', undefined as any, { shouldValidate: true })
                              }
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="file15ExpiryDate"
                    render={({ field }) => {
                      const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
                      return (
                        <FormItem className="w-full">
                          <div className="mb-2 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                            <FormLabel required={!!form.watch('file15Path')}>Amal qilish muddati</FormLabel>
                            <DatePicker
                              disableStrategy="before"
                              className={'w-full sm:max-w-[65%]'}
                              value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                              onChange={field.onChange}
                              placeholder="Amal qilish muddati"
                              disabled={!form.watch('file15Path')}
                            />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )
                    }}
                  />
                </div>
              )}
            </div>
          </CardForm>

          <div className="flex justify-start">
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saqlanmoqda...' : 'Saqlash'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default UpdateOrganization
