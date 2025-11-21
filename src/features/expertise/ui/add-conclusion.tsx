import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getHfoByTinSelect,
  getLegalInfoByTin,
  createExpertiseApplication,
} from '@/entities/expertise/api/expertise.api';
import { AddExpertiseFormValues } from '@/entities/expertise/model/expertise.types';
import { addExpertiseSchema } from '@/entities/expertise/model/expertise.schema';
import { ExpertiseSubTypeOptions, ExpertiseTypeOptions } from '@/entities/expertise/model/constants';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { useDistrictSelectQueries, useRegionSelectQueries } from '@/shared/api/dictionaries';
import { PhoneInput } from '@/shared/components/ui/phone-input';
import { cleanParams } from '@/shared/lib';
import { useNavigate } from 'react-router-dom';
import { Textarea } from '@/shared/components/ui/textarea';

export const AddConclusion = () => {
  const [stir, setStir] = useState('');
  const [searchedStir, setSearchedStir] = useState<string | null>(null);
  const navigate = useNavigate();
  const form = useForm<AddExpertiseFormValues>({
    resolver: zodResolver(addExpertiseSchema),
    mode: 'onChange',
    defaultValues: {
      customerTin: '',
      customerPhoneNumber: '',
      hfId: undefined,
      type: undefined,
      objectName: '',
      regionId: undefined,
      districtId: undefined,
      address: '',
      subType: undefined,
      prefix: '',
    },
  });

  const watchedRegionId = form.watch('regionId');
  const watchedHfId = form.watch('hfId');

  const {
    data: legalInfo,
    isFetching: isLegalInfoLoading,
    isError: isLegalInfoError,
  } = useQuery({
    queryKey: ['legalInfo', searchedStir],
    queryFn: () => getLegalInfoByTin(searchedStir!),
    enabled: !!searchedStir,
    retry: 1,
  });

  const { data: hfoOptions, isFetching: isHfoLoading } = useQuery({
    queryKey: ['hfoSelect', searchedStir],
    queryFn: () => getHfoByTinSelect(searchedStir!),
    enabled: !!searchedStir,
    retry: 1,
  });

  const selectedRegionId = form.watch('regionId');
  const { data: regions, isLoading: isRegionLoading } = useRegionSelectQueries();
  const { data: districts, isLoading: isDistrictLoading } = useDistrictSelectQueries(selectedRegionId);

  const { mutate, isPending: isSubmitting } = useMutation({
    mutationFn: createExpertiseApplication,
    onSuccess: () => {
      toast.success('Muvaffaqiyatli saqlandi!', { richColors: true });
      navigate(-1);
      handleClearSearch();
    },
  });

  useEffect(() => {
    if (legalInfo && searchedStir) {
      form.setValue('customerTin', searchedStir);
      form.setValue(
        'customerPhoneNumber',
        legalInfo?.phoneNumber?.length == 9
          ? `+998${legalInfo?.phoneNumber}`
          : legalInfo?.phoneNumber?.length == 12
            ? `+${legalInfo?.phoneNumber}`
            : `${legalInfo?.phoneNumber}`,
      );
    }
  }, [legalInfo, searchedStir, form]);

  const selectedHfo = hfoOptions?.find((hfo) => hfo.id === watchedHfId);
  useEffect(() => {
    if (watchedHfId && hfoOptions) {
      if (selectedHfo) {
        form.setValue('objectName', selectedHfo.name || '');
        form.setValue(
          'regionId',
          selectedHfo.regionId
            ? (selectedHfo.regionId?.toString() as unknown as string)
            : (undefined as unknown as string),
        );
        form.setValue(
          'districtId',
          selectedHfo.districtId
            ? (selectedHfo.districtId?.toString() as unknown as string)
            : (undefined as unknown as string),
        );
        form.setValue('address', selectedHfo.address || '');
      }
    }
  }, [watchedHfId, hfoOptions, form]);

  // Qidirish
  const handleSearch = () => {
    if (stir.length === 9) {
      setSearchedStir(stir);
    } else {
      toast.warning('STIR 9 ta raqamdan iborat bo‘lishi kerak.');
    }
  };

  // Tozalash
  const handleClearSearch = () => {
    setStir('');
    setSearchedStir(null);
    form.reset();
  };

  // Formani yuborish
  const onSubmit = (data: AddExpertiseFormValues) => {
    mutate(cleanParams({ ...data }));
  };

  const hasLegalInfo = !!legalInfo && !isLegalInfoError;

  return (
    <div className="space-y-2 mt-4">
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
              <div className="grid grid-cols-2 gap-2 py-4 px-2.5 rounded-lg content-center odd:bg-neutral-50 items-center">
                <h2 className="font-medium text-normal text-gray-700">Tashkilot nomi:</h2>
                <p className="font-normal text-normal text-gray-900">{legalInfo?.legalName || '-'}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 py-4 px-2.5 rounded-lg content-center odd:bg-neutral-50 items-center">
                <h2 className="font-medium text-normal text-gray-700">Tashkilot rahbari F.I.Sh.:</h2>
                <p className="font-normal text-normal text-gray-900">{legalInfo?.fullName || '-'}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 py-4 px-2.5 rounded-lg content-center odd:bg-neutral-50 items-center">
                <h2 className="font-medium text-normal text-gray-700">Manzil:</h2>
                <p className="font-normal text-normal text-gray-900">{legalInfo?.legalAddress || '-'}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 py-4 px-2.5 rounded-lg content-center odd:bg-neutral-50 items-center">
                <h2 className="font-medium text-normal text-gray-700">Telefon raqami:</h2>
                <p className="font-normal text-normal text-gray-900">{legalInfo?.phoneNumber || '-'}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Ariza maʼlumotlari</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                    name="hfId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Xavfli ishlab chiqarish obyekti</FormLabel>
                        <Select
                          value={field.value?.toString()}
                          onValueChange={(value) => {
                            if (value) {
                              field.onChange(value);
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
                        <FormLabel>Obyekt nomi</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={!!selectedHfo?.name} placeholder="Obyekt nomini kiriting..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Manzil</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={!!selectedHfo?.address} placeholder="Manzilni kiriting..." />
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
                            field.onChange(value);
                            form.setValue('districtId', undefined as unknown as string);
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
                              field.onChange(value);
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
                        <FormLabel>Ekspertiza turi</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            if (value) {
                              field.onChange(value);
                            }
                          }}
                        >
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

                  <FormField
                    control={form.control}
                    name="subType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ekspertiza obyekti turi</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            if (value) {
                              field.onChange(value);
                            }
                          }}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Tanlang..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ExpertiseSubTypeOptions.filter((i) => i?.type == form.watch('type')).map((option) => (
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

                  <FormField
                    control={form.control}
                    name="prefix"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ekspertiza obyekti nomi</FormLabel>
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

                  <div className="md:col-span-4 flex justify-end">
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
  );
};
