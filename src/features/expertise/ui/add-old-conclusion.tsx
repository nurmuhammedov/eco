import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getHfoByTinSelect,
  getLegalInfoByTin,
  createOldExpertiseApplication,
} from '@/entities/expertise/api/expertise.api'
import { AddOldExpertiseFormValues } from '@/entities/expertise/model/expertise.types'
import { addOldExpertiseSchema } from '@/entities/expertise/model/expertise.schema'
import DatePicker from '@/shared/components/ui/datepicker'
import { ExpertiseTypeEnum, ExpertiseTypeOptions } from '@/entities/expertise/model/constants'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { useDistrictSelectQueries, useRegionSelectQueries } from '@/shared/api/dictionaries'
import { PhoneInput } from '@/shared/components/ui/phone-input'
import { cleanParams } from '@/shared/lib'
import { useNavigate } from 'react-router-dom'
import { Textarea } from '@/shared/components/ui/textarea'
import DetailRow from '@/shared/components/common/detail-row'
import { InputFile } from '@/shared/components/common/file-upload/ui/file-upload'
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types'

export const AddOldConclusion = () => {
  const [stir, setStir] = useState('')
  const [searchedStir, setSearchedStir] = useState<string | null>(null)
  const navigate = useNavigate()
  const form = useForm<AddOldExpertiseFormValues>({
    resolver: zodResolver(addOldExpertiseSchema),
    mode: 'onChange',
    defaultValues: {
      customerTin: '',
      customerPhoneNumber: '',
      hfId: undefined,
      type: ExpertiseTypeEnum.XD,
      objectName: '',
      regionId: undefined,
      districtId: undefined,
      address: '',
      expertiseName: '',
      conclusionFilePath: '',
      declarationFilePath: '',
      calculationLetterPath: '',
      informationNotePath: '',
      conclusionRegistryNumber: '',
      declarationRegistryNumber: '',
      conclusionRegistrationDate: undefined,
      declarationRegistrationDate: undefined,
    },
  })

  const watchedRegionId = form.watch('regionId')
  const watchedHfId = form.watch('hfId')
  const watchedType = form.watch('type')

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

  const selectedRegionId = form.watch('regionId')
  const { data: regions, isLoading: isRegionLoading } = useRegionSelectQueries()
  const { data: districts, isLoading: isDistrictLoading } = useDistrictSelectQueries(selectedRegionId)

  const { mutate, isPending: isSubmitting } = useMutation({
    mutationFn: createOldExpertiseApplication,
    onSuccess: () => {
      toast.success('Muvaffaqiyatli saqlandi!', { richColors: true })
      navigate(-1)
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
        form.setValue('objectName', selectedHfo.name || '')
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
  const onSubmit = (data: AddOldExpertiseFormValues) => {
    const payload: any = {
      ...data,
      customerTin: data.customerTin ? Number(data.customerTin) : undefined,
      regionId: data.regionId ? Number(data.regionId) : undefined,
      districtId: data.districtId ? Number(data.districtId) : undefined,
    }

    mutate(cleanParams(payload))
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
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                >
                  <FormField
                    control={form.control}
                    name="customerTin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>STIR</FormLabel>
                        <FormControl>
                          <Input {...field} disabled />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hfId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>XICHO</FormLabel>
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
                    name="objectName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Obyekt nomi</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={!!selectedHfo?.name} placeholder="Obyekt nomini kiriting..." />
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
                        <FormLabel required>Viloyat</FormLabel>
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
                        <FormLabel required>Tuman/Shahar</FormLabel>
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
                        <FormLabel required>
                          Manzil <span className="font-normal text-red-400">(viloyat va tuman kiritilmasin)</span>
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

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Ekspertiza turi</FormLabel>
                        <Select value={field.value} disabled>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Tanlang..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ExpertiseTypeOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {watchedType === ExpertiseTypeEnum.XD && (
                    <>
                      <FormField
                        control={form.control}
                        name="conclusionRegistryNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>Ekspertiza xulosasi ro‘yxat raqami</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Kiriting..." />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="conclusionRegistrationDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel required>Ekspertiza xulosasi ro‘yxatga olingan sana</FormLabel>
                            <FormControl>
                              <DatePicker value={field.value} onChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="declarationRegistryNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>Deklaratsiya ro‘yxat raqami</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Kiriting..." />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="declarationRegistrationDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel required>Deklaratsiya ro‘yxatga olingan sana</FormLabel>
                            <FormControl>
                              <DatePicker value={field.value} onChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="conclusionFilePath"
                        render={({ field }) => (
                          <FormItem className="flex flex-col !gap-1">
                            <FormLabel required>Ekspertiza xulosasi fayli</FormLabel>
                            <FormControl>
                              <InputFile
                                name={field.name}
                                form={form}
                                uploadEndpoint="/attachments/conclusions"
                                accept={[FileTypes.PDF]}
                                buttonText="Faylni biriktirish"
                                maxSize={20}
                                showPreview
                                showDownload
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="declarationFilePath"
                        render={({ field }) => (
                          <FormItem className="flex flex-col !gap-1">
                            <FormLabel required>Deklaratsiya fayli</FormLabel>
                            <FormControl>
                              <InputFile
                                name={field.name}
                                form={form}
                                uploadEndpoint="/attachments/declarations"
                                accept={[FileTypes.PDF]}
                                buttonText="Faylni biriktirish"
                                maxSize={20}
                                showPreview
                                showDownload
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="calculationLetterPath"
                        render={({ field }) => (
                          <FormItem className="flex flex-col !gap-1">
                            <FormLabel required>Hisob-kitob tushuntirish xati</FormLabel>
                            <FormControl>
                              <InputFile
                                name={field.name}
                                form={form}
                                uploadEndpoint="/attachments/declarations"
                                accept={[FileTypes.PDF]}
                                buttonText="Faylni biriktirish"
                                maxSize={20}
                                showPreview
                                showDownload
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="informationNotePath"
                        render={({ field }) => (
                          <FormItem className="flex flex-col !gap-1">
                            <FormLabel required>Axborotnoma</FormLabel>
                            <FormControl>
                              <InputFile
                                name={field.name}
                                form={form}
                                uploadEndpoint="/attachments/declarations"
                                accept={[FileTypes.PDF]}
                                buttonText="Faylni biriktirish"
                                maxSize={20}
                                showPreview
                                showDownload
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {/*<FormField*/}
                  {/*  control={form.control}*/}
                  {/*  name="subType"*/}
                  {/*  render={({ field }) => (*/}
                  {/*    <FormItem>*/}
                  {/*      <FormLabel>Ekspertiza obyekti turi</FormLabel>*/}
                  {/*      <Select*/}
                  {/*        value={field.value}*/}
                  {/*        onValueChange={(value) => {*/}
                  {/*          if (value) {*/}
                  {/*            field.onChange(value);*/}
                  {/*          }*/}
                  {/*        }}*/}
                  {/*      >*/}
                  {/*        <FormControl>*/}
                  {/*          <SelectTrigger>*/}
                  {/*            <SelectValue placeholder="Tanlang..." />*/}
                  {/*          </SelectTrigger>*/}
                  {/*        </FormControl>*/}
                  {/*        <SelectContent>*/}
                  {/*          {ExpertiseSubTypeOptions.filter((i) => i?.type == form.watch('type')).map((option) => (*/}
                  {/*            <SelectItem key={option.value} value={option.value}>*/}
                  {/*              {option.label}*/}
                  {/*            </SelectItem>*/}
                  {/*          ))}*/}
                  {/*        </SelectContent>*/}
                  {/*      </Select>*/}
                  {/*      <FormMessage />*/}
                  {/*    </FormItem>*/}
                  {/*  )}*/}
                  {/*/>*/}

                  <FormField
                    control={form.control}
                    name="expertiseName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Ekspertiza obyekti nomi</FormLabel>
                        <FormControl>
                          <Textarea
                            className="resize-none"
                            rows={7}
                            placeholder="Obyekt nomini kiriting..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="col-span-full mt-4 flex justify-end">
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
