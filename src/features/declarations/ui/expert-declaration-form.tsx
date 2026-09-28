import { useHazardousFacilityByTinQuery, useLegalInfoByTinQuery } from '@/shared/api/dictionaries'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  type DeclarationDetail,
  type ExpertDeclarationFormValues,
  type ExpertDeclarationPayload,
  expertDeclarationSchema,
} from '@/entities/declarations/model/declaration.types'
import type { ConclusionOption } from '@/entities/expertise/model/conclusion.types'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { MultiSelect } from '@/shared/components/ui/multi-select'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { InputFile } from '@/shared/components/common/file-upload'
import { FileTypes } from '@/shared/components/common/file-upload/model/file-types'
import { useNavigate, useParams } from 'react-router-dom'
import DetailRow from '@/shared/components/common/detail-row'
import useData from '@/shared/hooks/api/use-data'
import useAdd from '@/shared/hooks/api/use-add'
import { useUpdate } from '@/shared/hooks'
import { toast } from 'sonner'

interface ExpertDeclarationFormProps {
  initialData?: DeclarationDetail
  isEdit?: boolean
}

export const ExpertDeclarationForm = ({ initialData, isEdit }: ExpertDeclarationFormProps) => {
  const { id } = useParams()
  const [stir, setStir] = useState(initialData?.customerTin?.toString() || '')
  const [searchedStir, setSearchedStir] = useState<string | null>(initialData?.customerTin?.toString() || null)
  const navigate = useNavigate()

  const form = useForm<ExpertDeclarationFormValues>({
    resolver: zodResolver(expertDeclarationSchema),
    mode: 'onChange',
    defaultValues: {
      customerTin: initialData?.customerTin?.toString() || '',
      hfIds: initialData?.hfIds || [],
      conclusionId: initialData?.conclusionId ?? undefined,
      declarationPath: initialData?.declarationPath ?? undefined,
      infoLetterPath: initialData?.infoLetterPath ?? undefined,
      explanatoryNotePath: initialData?.explanatoryNotePath ?? undefined,
    },
  })

  const {
    data: legalInfo,
    isFetching: isLegalInfoLoading,
    isError: isLegalInfoError,
  } = useLegalInfoByTinQuery(searchedStir)

  const { data: hfOptions, isFetching: isHfLoading } = useHazardousFacilityByTinQuery(searchedStir)

  const { data: conclusionOptions, isFetching: isConclusionsLoading } = useData<ConclusionOption[]>(
    '/conclusions/select',
    !!searchedStir,
    { customerTin: searchedStir }
  )

  const {
    mutate: createMutate,
    isPending: isCreating,
    isSuccess: isCreateSuccess,
  } = useAdd<ExpertDeclarationPayload>('/declarations/by-expert')

  const {
    mutate: updateMutate,
    isPending: isUpdating,
    isSuccess: isUpdateSuccess,
  } = useUpdate<ExpertDeclarationPayload>('/declarations/by-expert', id, 'put', 'Muvaffaqiyatli yangilandi!')

  const isSubmitting = isCreating || isUpdating
  const isSuccess = isCreateSuccess || isUpdateSuccess

  useEffect(() => {
    if (isSuccess) {
      navigate('/declarations')
    }
  }, [isSuccess, navigate])

  useEffect(() => {
    if (legalInfo && searchedStir) {
      form.setValue('customerTin', searchedStir)
    }
  }, [legalInfo, searchedStir, form])

  const handleSearch = () => {
    if (stir.length === 9) {
      setSearchedStir(stir)
    } else {
      toast.warning('STIR 9 ta raqamdan iborat bo‘lishi kerak.')
    }
  }

  const handleClearSearch = () => {
    setStir('')
    setSearchedStir(null)
    form.reset()
  }

  const onSubmit = ({ customerTin, ...values }: ExpertDeclarationFormValues) => {
    const payload = { ...values, customerTin: Number(customerTin) }
    if (isEdit) updateMutate(payload)
    else createMutate(payload)
  }

  const hasLegalInfo = !!legalInfo && !isLegalInfoError

  return (
    <div className="mt-4 space-y-4">
      {!isEdit && (
        <Card>
          <CardHeader>
            <CardTitle>Buyurtmachi tashkilot STIRini kiriting</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-4">
              <Input
                placeholder="Buyurtmachi STIRini kiriting..."
                value={stir}
                onChange={(e) => setStir(e.target.value)}
                disabled={hasLegalInfo || isLegalInfoLoading}
                maxLength={9}
              />
              {hasLegalInfo ? (
                <Button variant="destructive" onClick={handleClearSearch} className="w-40">
                  O‘chirish
                </Button>
              ) : (
                <Button
                  onClick={handleSearch}
                  disabled={isLegalInfoLoading}
                  loading={isLegalInfoLoading}
                  className="w-40"
                >
                  Qidirish
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {hasLegalInfo && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Buyurtmachi ma’lumotlari</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-x-2 gap-y-2 md:grid-cols-1">
                <DetailRow title="Tashkilot nomi:" value={legalInfo?.legalName || '-'} />
                <DetailRow title="Tashkilot rahbari F.I.Sh.:" value={legalInfo?.fullName || '-'} />
                <DetailRow title="Manzil:" value={legalInfo?.legalAddress || '-'} />
                <DetailRow title="Telefon raqami:" value={legalInfo?.phoneNumber || '-'} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Deklaratsiya ma’lumotlari</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="customerTin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Buyurtmachi STIR</FormLabel>
                          <FormControl>
                            <Input {...field} disabled />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="conclusionId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required={true}>Ekspertiza xulosasi</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={(v) => {
                              if (v) {
                                field.onChange(v)
                              }
                            }}
                            disabled={isConclusionsLoading}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Xulosani tanlang..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {conclusionOptions?.map((option) => (
                                <SelectItem key={option.id} value={option.id}>
                                  {option.registryNumber || 'Noma’lum xulosa'}
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
                      name="hfIds"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>XICHOlar</FormLabel>
                          <FormControl>
                            <MultiSelect
                              options={
                                hfOptions?.map((opt) => ({
                                  id: opt.id,
                                  name: `${opt.registryNumber || 'N/A'} - ${opt.name}`,
                                })) || []
                              }
                              value={field.value}
                              onChange={(vals) => field.onChange(vals as string[])}
                              disabled={isHfLoading}
                              placeholder="Obyektlarni tanlang..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="declarationPath"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Deklaratsiya</FormLabel>
                          <FormControl>
                            <InputFile
                              buttonText="Faylni tanlang"
                              form={form}
                              uploadEndpoint="/attachments/declarations"
                              name={field.name}
                              accept={[FileTypes.PDF]}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="infoLetterPath"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Axborotnoma</FormLabel>
                          <FormControl>
                            <InputFile
                              buttonText="Faylni tanlang"
                              form={form}
                              uploadEndpoint="/attachments/declarations"
                              name={field.name}
                              accept={[FileTypes.PDF]}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="explanatoryNotePath"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Hisob-kitob tushuntirish xati</FormLabel>
                          <FormControl>
                            <InputFile
                              buttonText="Faylni tanlang"
                              form={form}
                              uploadEndpoint="/attachments/declarations"
                              name={field.name}
                              accept={[FileTypes.PDF]}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={isSubmitting} loading={isSubmitting} className="w-full md:w-40">
                      Yuborish
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
