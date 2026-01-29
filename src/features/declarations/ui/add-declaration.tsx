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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { useDistrictSelectQueries, useRegionSelectQueries } from '@/shared/api/dictionaries'
import { PhoneInput } from '@/shared/components/ui/phone-input'
import { cleanParams } from '@/shared/lib'
import { InputFile } from '@/shared/components/common/file-upload'
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types'
import { useNavigate } from 'react-router-dom'

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
      hfId: undefined,
      hfName: '',
      hfRegistryNumber: '',
      regionId: undefined,
      districtId: undefined,
      address: '',
      conclusionId: undefined,
      filePath: undefined,
    },
  })

  const watchedRegionId = form.watch('regionId')
  const watchedHfId = form.watch('hfId')

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

  // New query for Expertise Conclusions
  const { data: conclusionOptions, isFetching: isConclusionsLoading } = useQuery({
    queryKey: ['conclusionsSelect', searchedStir],
    queryFn: () => getExpertiseConclusionsSelect(searchedStir!),
    enabled: !!searchedStir,
    retry: 1,
  })

  const selectedRegionId = form.watch('regionId')
  const { data: regions, isLoading: isRegionLoading } = useRegionSelectQueries()
  const { data: districts, isLoading: isDistrictLoading } = useDistrictSelectQueries(selectedRegionId)

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

  const selectedHfo = hfoOptions?.find((hfo) => hfo.id === watchedHfId)
  useEffect(() => {
    if (watchedHfId && hfoOptions) {
      if (selectedHfo) {
        form.setValue('hfName', selectedHfo.name || '')
        form.setValue('hfRegistryNumber', selectedHfo.registryNumber || '')
        form.setValue(
          'regionId',
          selectedHfo.regionId
            ? (selectedHfo.regionId?.toString() as unknown as string)
            : (undefined as unknown as string)
        )
        form.setValue(
          'districtId',
          selectedHfo.districtId
            ? (selectedHfo.districtId?.toString() as unknown as string)
            : (undefined as unknown as string)
        )
        form.setValue('address', selectedHfo.address || '')
      }
    }
  }, [watchedHfId, hfoOptions, form])

  // Qidirish
  const handleSearch = () => {
    if (stir.length === 9) {
      setSearchedStir(stir)
    } else {
      toast.warning('STIR 9 ta raqamdan iborat bo‘lishi kerak.')
    }
  }

  // Tozalash
  const handleClearSearch = () => {
    setStir('')
    setSearchedStir(null)
    form.reset()
  }

  // Formani yuborish
  const onSubmit = (data: CreateDeclarationFormValues) => {
    mutate(cleanParams({ ...data }) as any)
  }

  const hasLegalInfo = !!legalInfo && !isLegalInfoError

  return (
    <div className="mt-4 space-y-2">
      <Card>
        <CardHeader>
          <CardTitle>Tashkilotni qidirish</CardTitle>
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
              <div className="grid grid-cols-2 content-center items-center gap-2 rounded-lg px-2.5 py-4 odd:bg-neutral-50">
                <h2 className="text-normal font-medium text-gray-700">Tashkilot nomi:</h2>
                <p className="text-normal font-normal text-gray-900">{legalInfo?.legalName || '-'}</p>
              </div>
              <div className="grid grid-cols-2 content-center items-center gap-2 rounded-lg px-2.5 py-4 odd:bg-neutral-50">
                <h2 className="text-normal font-medium text-gray-700">Tashkilot rahbari F.I.Sh.:</h2>
                <p className="text-normal font-normal text-gray-900">{legalInfo?.fullName || '-'}</p>
              </div>
              <div className="grid grid-cols-2 content-center items-center gap-2 rounded-lg px-2.5 py-4 odd:bg-neutral-50">
                <h2 className="text-normal font-medium text-gray-700">Manzil:</h2>
                <p className="text-normal font-normal text-gray-900">{legalInfo?.legalAddress || '-'}</p>
              </div>
              <div className="grid grid-cols-2 content-center items-center gap-2 rounded-lg px-2.5 py-4 odd:bg-neutral-50">
                <h2 className="text-normal font-medium text-gray-700">Telefon raqami:</h2>
                <p className="text-normal font-normal text-gray-900">{legalInfo?.phoneNumber || '-'}</p>
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
                    name="hfId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Xavfli ishlab chiqarish obyekti</FormLabel>
                        <Select
                          value={field.value?.toString()}
                          onValueChange={(value) => {
                            if (value) {
                              field.onChange(value)
                            }
                          }}
                          disabled={isHfoLoading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Obyektni tanlang..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {hfoOptions?.map((option) => (
                              <SelectItem key={option.id} value={option.id}>
                                {`${option.registryNumber || 'N/A'} - ${option.name}`}
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
                    name="hfName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>XICHO nomi</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={!!selectedHfo?.name} placeholder="XICHO nomini kiriting..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="regionId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Viloyat</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value)
                            form.setValue('districtId', undefined as unknown as string)
                          }}
                          value={field.value}
                          disabled={isRegionLoading || !!selectedHfo?.regionId}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Viloyatni tanlang..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {regions?.map((region: any) => (
                              <SelectItem key={region.id} value={region.id?.toString()}>
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
                    control={form.control}
                    name="districtId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tuman/Shahar</FormLabel>
                        <Select
                          {...field}
                          value={field.value}
                          onValueChange={(value) => {
                            if (value) {
                              field.onChange(value)
                            }
                          }}
                          disabled={isDistrictLoading || !watchedRegionId || !!selectedHfo?.districtId}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Tumanni tanlang..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {districts?.map((district: any) => (
                              <SelectItem key={district.id} value={district.id?.toString()}>
                                {district.name}
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
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Manzil <span className="text-red-400">(viloyat va tuman kiritilmasin)</span>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} disabled={!!selectedHfo?.address} placeholder="Manzilni kiriting..." />
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
