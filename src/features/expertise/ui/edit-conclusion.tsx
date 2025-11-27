import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addExpertiseSchema } from '@/entities/expertise/model/expertise.schema';
import { AddExpertiseFormValues } from '@/entities/expertise/model/expertise.types';
import { ExpertiseTypeEnum, ExpertiseTypeOptions } from '@/entities/expertise/model/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { PhoneInput } from '@/shared/components/ui/phone-input';
import { useDetail, useUpdate } from '@/shared/hooks';
import { useDistrictSelectQueries, useRegionSelectQueries } from '@/shared/api/dictionaries';
import { useQuery } from '@tanstack/react-query';
import { getHfoByTinSelect } from '@/entities/expertise/api/expertise.api';
import { Textarea } from '@/shared/components/ui/textarea';

export const UpdateConclusion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { detail: conclusion, isFetching } = useDetail<any>('/conclusions', id, !!id);

  const form = useForm<AddExpertiseFormValues>({
    resolver: zodResolver(addExpertiseSchema),
    mode: 'onChange',
  });

  const { mutateAsync, isPending } = useUpdate<AddExpertiseFormValues, any, any>(
    '/conclusions',
    id,
    'put',
    'Muvaffaqiyatli yangilandi!',
  );

  const { data: hfoOptions } = useQuery({
    queryKey: ['hfoSelect', form.watch('customerTin')],
    queryFn: () => getHfoByTinSelect(form.watch('customerTin')),
    enabled: !!form.watch('customerTin'),
    retry: 1,
  });

  const selectedRegionId = form.watch('regionId');
  const { data: regions } = useRegionSelectQueries();
  const { data: districts } = useDistrictSelectQueries(selectedRegionId);

  useEffect(() => {
    if (conclusion) {
      form.reset({
        ...conclusion,
        customerTin: conclusion?.customerTin?.toString(),
        type: conclusion.type?.toString() as unknown as ExpertiseTypeEnum,
        expertiseName: conclusion?.expertiseName,
        regionId: conclusion?.regionId?.toString(),
        districtId: conclusion?.districtId?.toString(),
      });
    }
  }, [conclusion]);

  const onSubmit = (data: AddExpertiseFormValues) => {
    mutateAsync(data).then(() => navigate(-1));
  };

  if (isFetching) {
    return (
      <Card className="mt-4">
        <CardContent>
          <p className="p-4 text-center">Yuklanmoqda...</p>
        </CardContent>
      </Card>
    );
  }

  if (!conclusion) {
    return (
      <Card className="mt-4">
        <CardContent>
          <p className="p-4 text-center">Maʼlumotlar topilmadi</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 mt-4">
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
                      disabled={true}
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
                      <Input {...field} disabled />
                    </FormControl>
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
                      <Input {...field} disabled />
                    </FormControl>
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
                        if (value) {
                          field.onChange(value);
                        }
                      }}
                      value={field.value?.toString()}
                      disabled={true}
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
                      value={field.value?.toString()}
                      onValueChange={(value) => {
                        if (value) {
                          field.onChange(value);
                        }
                      }}
                      disabled={true}
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
                name="customerPhoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefon raqami</FormLabel>
                    <FormControl>
                      <PhoneInput disabled={conclusion?.processStatus == 'COMPLETED'} {...field} />
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
                      {...field}
                      disabled={conclusion?.processStatus == 'COMPLETED'}
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
                          <SelectItem key={option.value} value={option.value?.toString()}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/*<FormField*/}
              {/*  control={form.control}*/}
              {/*  name="subType"*/}
              {/*  render={({ field }) => (*/}
              {/*    <FormItem>*/}
              {/*      <FormLabel>Ekspertiza obyekti turi</FormLabel>*/}
              {/*      <Select*/}
              {/*        disabled={conclusion?.processStatus == 'COMPLETED'}*/}
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
                    <FormLabel>Ekspertiza obyekti nomi</FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={conclusion?.processStatus == 'COMPLETED'}
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

              {conclusion?.processStatus != 'COMPLETED' && (
                <div className="md:col-span-4 flex justify-end">
                  <Button type="submit" disabled={isPending} loading={isPending}>
                    Yangilash
                  </Button>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
