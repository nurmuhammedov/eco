import { EmployeeLevel } from '@/entities/attestation/model/attestation.types';
import { GoBack } from '@/shared/components/common';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import DatePicker from '@/shared/components/ui/datepicker';
import DateTimePicker from '@/shared/components/ui/datetimepicker';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { PhoneInput } from '@/shared/components/ui/phone-input';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { useDetail } from '@/shared/hooks';
import { getSelectOptions } from '@/shared/lib/get-select-options';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useCreateAttestation } from '../../model/use-create-attestation';

const EmployeeFields = ({
  form,
  index,
  employeeOptions,
  isEmployeeLoading,
  selectedEmployeeId,
  onEmployeeSelect,
  direction,
}: any) => {
  const { data: employeeDetail } = useDetail<any>('/employee/', selectedEmployeeId, !!selectedEmployeeId);

  useEffect(() => {
    if (employeeDetail) {
      const parseDateString = (value: string | undefined | null): Date | undefined => {
        if (value && !isNaN(Date.parse(value))) {
          return new Date(value);
        }
        return undefined;
      };

      form.setValue(`employeeList.${index}.pin`, employeeDetail.pin);
      form.setValue(`employeeList.${index}.fullName`, employeeDetail.name);
      form.setValue(`employeeList.${index}.profession`, employeeDetail.profession);
      form.setValue(`employeeList.${index}.level`, employeeDetail.level);
      form.setValue(`employeeList.${index}.certNumber`, employeeDetail.certNumber);
      form.setValue(
        `employeeList.${index}.certDate`,
        employeeDetail.certDate ? parseDateString(employeeDetail?.certDate) : undefined,
      );
      form.setValue(
        `employeeList.${index}.certExpiryDate`,
        employeeDetail.certExpiryDate ? parseDateString(employeeDetail?.certExpiryDate) : undefined,
      );
      form.setValue(
        `employeeList.${index}.ctcTrainingFromDate`,
        employeeDetail.ctcTrainingFromDate ? parseDateString(employeeDetail?.ctcTrainingFromDate) : undefined,
      );
      form.setValue(
        `employeeList.${index}.ctcTrainingToDate`,
        employeeDetail.ctcTrainingToDate ? parseDateString(employeeDetail?.ctcTrainingToDate) : undefined,
      );
      form.setValue(
        `employeeList.${index}.dateOfEmployment`,
        employeeDetail.dateOfEmployment ? parseDateString(employeeDetail?.dateOfEmployment) : undefined,
      );
    }
    form.clearErrors([
      `employeeList.${index}.pin`,
      `employeeList.${index}.fullName`,
      `employeeList.${index}.profession`,
      `employeeList.${index}.level`,
      `employeeList.${index}.certNumber`,
      `employeeList.${index}.certDate`,
      `employeeList.${index}.certExpiryDate`,
      `employeeList.${index}.ctcTrainingFromDate`,
      `employeeList.${index}.ctcTrainingToDate`,
      `employeeList.${index}.dateOfEmployment`,
    ]);
  }, [employeeDetail, form, index]);

  const employeeLevelOptions = useMemo(() => {
    const allOptions: { id: EmployeeLevel; name: string }[] = [
      { id: EmployeeLevel.LEADER, name: 'Rahbar' },
      { id: EmployeeLevel.TECHNICIAN, name: 'Muhandis-texnik xodim' },
      { id: EmployeeLevel.EMPLOYEE, name: 'Oddiy xodim' },
    ];

    if (direction === 'COMMITTEE') {
      return allOptions.filter((opt) => opt.id === EmployeeLevel.LEADER);
    }

    if (direction === 'REGIONAL') {
      return allOptions.filter((opt) => opt.id === EmployeeLevel.TECHNICIAN || opt.id === EmployeeLevel.EMPLOYEE);
    }

    return [];
  }, [direction]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1">
          <FormItem>
            <FormLabel>Xodimni tanlang</FormLabel>
            <Select
              onValueChange={(value) => onEmployeeSelect(index, value)}
              value={selectedEmployeeId || ''}
              disabled={isEmployeeLoading}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Xodimni tanlang" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>{getSelectOptions(employeeOptions || [])}</SelectContent>
            </Select>
          </FormItem>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <FormField
          control={form.control}
          name={`employeeList.${index}.pin`}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>JSHSHIR</FormLabel>
              <FormControl>
                <Input placeholder="JSHSHIRni kiriting" {...field} disabled={true} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`employeeList.${index}.fullName`}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Attestatsiyadan o'tkaziladigan xodim FIO</FormLabel>
              <FormControl>
                <Input placeholder="F.I.SH.ni kiriting" {...field} disabled={true} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`employeeList.${index}.profession`}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Xodim lavozimi</FormLabel>
              <FormControl>
                <Input placeholder="Lavozimni kiriting" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`employeeList.${index}.level`}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Xodim lavozim turi</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Lavozim turini tanlang" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>{getSelectOptions(employeeLevelOptions)}</SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`employeeList.${index}.ctcTrainingFromDate`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>“Kontexnazorato‘quv” DMda o‘qigan muddati</FormLabel>
              <DatePicker
                value={field.value ? new Date(field.value) : undefined}
                onChange={(date) => field.onChange(date)}
                placeholder="dan"
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`employeeList.${index}.ctcTrainingToDate`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>“Kontexnazorato‘quv” DMda o‘qigan muddati</FormLabel>
              <DatePicker
                value={field.value ? new Date(field.value) : undefined}
                onChange={(date) => field.onChange(date)}
                placeholder="gacha"
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`employeeList.${index}.certNumber`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sertifikat raqami</FormLabel>
              <FormControl>
                <Input placeholder="Sertifikat raqamini kiriting" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`employeeList.${index}.certDate`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sertifikat sanasi</FormLabel>
              <DatePicker
                value={field.value ? new Date(field.value) : undefined}
                onChange={(date) => field.onChange(date)}
                placeholder="Sanani tanlang"
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`employeeList.${index}.certExpiryDate`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sertifikat muddati</FormLabel>
              <DatePicker
                value={field.value ? new Date(field.value) : undefined}
                onChange={(date) => field.onChange(date)}
                placeholder="Sanani tanlang"
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`employeeList.${index}.dateOfEmployment`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ishga kirgan sanasi</FormLabel>
              <DatePicker
                value={field.value ? new Date(field.value) : undefined}
                onChange={(date) => field.onChange(date)}
                placeholder="Sanani tanlang"
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

const RegisterAttestationForm = ({ onSubmit }: any) => {
  const {
    form,
    fields,
    addEmployee,
    remove,
    directions,
    regionOptions,
    isRegionLoading,
    districtOptions,
    isDistrictLoading,
    hfOptions,
    isHfLoading,
    employeeOptions,
    isEmployeeLoading,
  } = useCreateAttestation();

  const directionValue = form.watch('direction');

  const [selectedEmployees, setSelectedEmployees] = useState<Record<number, string>>({});

  const handleEmployeeSelect = (index: number, employeeId: string) => {
    setSelectedEmployees((prev) => ({ ...prev, [index]: employeeId }));
  };

  const hfId = form.watch('hfId');

  const { data: hfDetail } = useDetail<any>('/hf', hfId, !!hfId);

  useEffect(() => {
    if (hfDetail) {
      form.setValue('hfRegistryNumber', hfDetail.registryNumber?.toString());
      form.setValue('upperOrganizationName', hfDetail.upperOrganization?.toString());
      form.setValue('legalName', hfDetail.legalName?.toString());
      form.setValue('legalTin', hfDetail.legalTin?.toString());
      form.setValue('hfName', hfDetail.name?.toString());
      form.setValue('employeeList', []);

      form.clearErrors(['hfRegistryNumber', 'upperOrganizationName', 'legalName', 'legalTin', 'hfName']);
    }
  }, [hfDetail, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <GoBack title="XICHO xodimlarini attestatsiyadan o‘tkazish arizasi" />
        <Card>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-1">
                <FormField
                  control={form.control}
                  name="hfId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>XICHOni tanlang</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={isHfLoading}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="XICHO'ni tanlang" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>{getSelectOptions(hfOptions || [])}</SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              <FormField
                control={form.control}
                name="hfRegistryNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>XICHOning hisobga olish raqami</FormLabel>
                    <FormControl>
                      <Input placeholder="Hisobga olish raqamini kiriting" {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="upperOrganizationName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Yuqori turuvchi tashkilotning nomi</FormLabel>
                    <FormControl>
                      <Input placeholder="Tashkilot nomini kiriting" {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="legalName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>XICHОdan foydalanuvchi tashkilotning nomi</FormLabel>
                    <FormControl>
                      <Input placeholder="Foydalanuvchi tashkilot nomini kiriting" {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="legalTin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>STIR</FormLabel>
                    <FormControl>
                      <Input placeholder="STIRni kiriting" {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hfName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>XICHOning nomi</FormLabel>
                    <FormControl>
                      <Input placeholder="XICHO nomini kiriting" {...field} disabled />
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
                    <FormLabel required>XICHO manzili</FormLabel>
                    <FormControl>
                      <Input placeholder="XICHO manzilini kiriting" {...field} />
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
                    <FormLabel required>XICHO viloyati</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isRegionLoading}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Viloyatni tanlang" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>{getSelectOptions(regionOptions || [])}</SelectContent>
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
                    <FormLabel required>XICHO tumani</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isDistrictLoading || !form.getValues('regionId')}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Tumanni tanlang" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>{getSelectOptions(districtOptions || [])}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="direction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Attestatsiyadan o‘tuvchilar tarkibi</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Tarkibni tanlang" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>{getSelectOptions(directions)}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Telefon raqam</FormLabel>
                    <FormControl>
                      <PhoneInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {directionValue === 'REGIONAL' && (
                <FormField
                  control={form.control}
                  name="dateOfAttestation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Texnik va oddiy xodimlar attestatsiyadan o'tkazish sanasi</FormLabel>
                      <FormControl>
                        <DateTimePicker
                          value={(field.value as unknown as Date) ?? undefined}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attestatsiyadan o‘tkaziladigan xodimlar to‘g‘risida maʼlumot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((item, index) => (
              <div key={item.id} className="border p-4 rounded-md relative">
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => remove(index)}
                    disabled={index === 0}
                    className="cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <EmployeeFields
                  form={form}
                  index={index}
                  employeeOptions={employeeOptions}
                  isEmployeeLoading={isEmployeeLoading || !hfId}
                  selectedEmployeeId={selectedEmployees[index]}
                  onEmployeeSelect={handleEmployeeSelect}
                  direction={directionValue}
                />
              </div>
            ))}
            <Button type="button" variant="success" onClick={addEmployee}>
              <PlusCircle className="mr-2 h-4 w-4" /> Attestatsiyaga xodim qo‘shish
            </Button>
          </CardContent>
        </Card>
        <Button type="submit" className="mt-1">
          Ariza yaratish
        </Button>
      </form>
    </Form>
  );
};

// @ts-ignore
export default RegisterAttestationForm;
