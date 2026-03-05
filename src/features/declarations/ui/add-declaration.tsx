import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getHfoByTinSelect, getLegalInfoByTin } from '@/entities/expertise/api/expertise.api'
import { createDeclaration, getExpertiseConclusionsSelect } from '@/entities/declarations/api/declaration.api'
import { CreateDeclarationFormValues, createDeclarationSchema } from '@/entities/declarations/model/declaration.types'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { MultiSelect } from '@/shared/components/ui/multi-select'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { PhoneInput } from '@/shared/components/ui/phone-input'
import { cleanParams } from '@/shared/lib'
import { InputFile } from '@/shared/components/common/file-upload'
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types'
import { useNavigate } from 'react-router-dom'
import DetailRow from '@/shared/components/common/detail-row'

export const AddDeclaration = () => {
  const [stir, setStir] = useState('')
  const [searchedStir, setSearchedStir] = useState<string | null>(null)
  const navigate = useNavigate()

  const form = useForm<CreateDeclarationFormValues>({
    resolver: zodResolver(createDeclarationSchema),
    mode: 'onChange',
    defaultValues: {
      customerTin: '',
      customerPhoneNumber: '',
      hfIds: [],
      conclusionId: undefined,
      filePath: undefined,
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

  const { data: hfoOptions, isFetching: isHfoLoading } = useQuery({
    queryKey: ['hfoSelect', searchedStir],
    queryFn: () => getHfoByTinSelect(searchedStir!),
    enabled: !!searchedStir,
    retry: 1,
  })

  const { data: conclusionOptions, isFetching: isConclusionsLoading } = useQuery({
    queryKey: ['conclusionsSelect', searchedStir],
    queryFn: () => getExpertiseConclusionsSelect(searchedStir!),
    enabled: !!searchedStir,
    retry: 1,
  })

  const { mutate, isPending: isSubmitting } = useMutation({
    mutationFn: createDeclaration,
    onSuccess: () => {
      toast.success('Muvaffaqiyatli saqlandi!', { richColors: true })
      navigate('/declarations')
      handleClearSearch()
    },
  })

  useEffect(() => {
    if (legalInfo && searchedStir) {
      form.setValue('customerTin', searchedStir)
      form.setValue(
        'customerPhoneNumber',
        legalInfo?.phoneNumber?.length == 9
          ? `+998${legalInfo?.phoneNumber}`
          : legalInfo?.phoneNumber?.length == 12
            ? `+${legalInfo?.phoneNumber}`
            : `${legalInfo?.phoneNumber}`
      )
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
    <div className="mt-4 space-y-2">
      <Card>
        <CardHeader>
          <CardTitle>XICHO tashkiloti STIRni kiriting</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-4">
            <Input
              placeholder="Tashkilot STIRini kiriting..."
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
              <CardTitle>Tashkilot maʼlumotlari</CardTitle>
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
              <CardTitle>Ariza maʼlumotlari</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <FormField
                    control={form.control}
                    name="customerTin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>STIR</FormLabel>
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
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            if (value) {
                              field.onChange(value)
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
                            {conclusionOptions?.map((option: any) => (
                              <SelectItem key={option.id} value={option.id}>
                                {option.registryNumber || option.name || 'Nomaʼlum xulosa'}
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
                      <FormItem>
                        <FormLabel>XICHOlar</FormLabel>
                        <FormControl>
                          <MultiSelect
                            options={
                              hfoOptions?.map((opt) => ({
                                id: opt.id,
                                name: `${opt.registryNumber || 'N/A'} - ${opt.name}`,
                              })) || []
                            }
                            value={field.value}
                            onChange={(vals) => field.onChange(vals as string[])}
                            disabled={isHfoLoading}
                            placeholder="Obyektlarni tanlang..."
                            searchPlaceholder="XICHO nomi/reyestr raqami"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="customerPhoneNumber"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Telefon raqami</FormLabel>
                        <FormControl>
                          <PhoneInput {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="col-span-2 md:col-span-2">
                    <FormField
                      control={form.control}
                      name="filePath"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Deklaratsiya fayli</FormLabel>
                          <FormControl>
                            <InputFile
                              buttonText="Faylni tanlang"
                              showPreview={true}
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

                  <div className="flex justify-end md:col-span-4">
                    <Button type="submit" disabled={isSubmitting} loading={isSubmitting}>
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
