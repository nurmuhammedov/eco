import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { getLegalInfoByTin } from '@/entities/expertise/api/expertise.api'
import { CreateDeclarationFormValues, createDeclarationSchema } from '@/entities/declarations/model/declaration.types'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { MultiSelect } from '@/shared/components/ui/multi-select'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { cleanParams } from '@/shared/lib'
import { InputFile } from '@/shared/components/common/file-upload'
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types'
import { useNavigate } from 'react-router-dom'
import DetailRow from '@/shared/components/common/detail-row'
import useData from '@/shared/hooks/api/useData'
import useAdd from '@/shared/hooks/api/useAdd'
import { toast } from 'sonner'

export const ExpertDeclarationForm = () => {
  const [stir, setStir] = useState('')
  const [searchedStir, setSearchedStir] = useState<string | null>(null)
  const navigate = useNavigate()

  const form = useForm<CreateDeclarationFormValues>({
    resolver: zodResolver(createDeclarationSchema),
    mode: 'onChange',
    defaultValues: {
      customerTin: '',
      hfIds: [],
      conclusionId: undefined,
      declarationPath: undefined,
      infoLetterPath: undefined,
      explanatoryNotePath: undefined,
    },
  })

  const {
    data: legalInfo,
    isFetching: isLegalInfoLoading,
    isError: isLegalInfoError,
  } = useQuery({
    queryKey: ['legalInfo', searchedStir],
    queryFn: () => getLegalInfoByTin(searchedStir!),
    enabled: !!searchedStir,
    retry: 1,
  })

  const { data: hfoOptions, isFetching: isHfoLoading } = useData<any[]>('/hf/by-tin/select', !!searchedStir, {
    legalTin: searchedStir,
  })

  const { data: conclusionOptions, isFetching: isConclusionsLoading } = useData<any[]>(
    '/conclusions/select',
    !!searchedStir,
    { customerTin: searchedStir }
  )

  const {
    mutate,
    isPending: isSubmitting,
    isSuccess,
  } = useAdd<CreateDeclarationFormValues, any, any>('/declarations/by-expert')

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

  const onSubmit = (data: CreateDeclarationFormValues) => {
    mutate(cleanParams({ ...data }) as any)
  }

  const hasLegalInfo = !!legalInfo && !isLegalInfoError

  return (
    <div className="mt-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Buyurtmachi (XICHO) tashkiloti STIRni kiriting</CardTitle>
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

      {hasLegalInfo && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Buyurtmachi maʼlumotlari</CardTitle>
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
              <CardTitle>Deklaratsiya maʼlumotlari</CardTitle>
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
                          <FormLabel>Ekspertiza xulosasi</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange} disabled={isConclusionsLoading}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Xulosani tanlang..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {conclusionOptions?.map((option: any) => (
                                <SelectItem key={option.id} value={option.id}>
                                  {option.registryNumber || 'Nomaʼlum xulosa'}
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
                                hfoOptions?.map((opt: any) => ({
                                  id: opt.id,
                                  name: `${opt.registryNumber || 'N/A'} - ${opt.name}`,
                                })) || []
                              }
                              value={field.value}
                              onChange={(vals) => field.onChange(vals as string[])}
                              disabled={isHfoLoading}
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
