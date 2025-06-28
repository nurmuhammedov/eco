import { EmployeeLevel } from '@/entities/attestation/model/attestation.types';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import DatePicker from '@/shared/components/ui/datepicker';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { PhoneInput } from '@/shared/components/ui/phone-input';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { getSelectOptions } from '@/shared/lib/get-select-options';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useCreateAttestation } from '../../model/use-create-attestation';

const RegisterAttestationForm = ({ onSubmit }: any) => {
  const {
    form,
    fields,
    addEmployee,
    remove,
    directions,
    // hfOptions,
    // isHfLoading,
    regionOptions,
    isRegionLoading,
    districtOptions,
    isDistrictLoading,
  } = useCreateAttestation();

  const employeeLevelOptions: { id: EmployeeLevel; name: string }[] = [
    { id: EmployeeLevel.LEADER, name: 'Rahbar' },
    { id: EmployeeLevel.TECHNICIAN, name: 'Muhandis-texnik xodim' },
    { id: EmployeeLevel.EMPLOYEE, name: 'Oddiy xodim' },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>XICHO xodimlarini attestatsiyadan o‘tkazish arizasi</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/*<FormField*/}
            {/*  control={form.control}*/}
            {/*  name="hfId"*/}
            {/*  render={({ field }) => (*/}
            {/*    <FormItem>*/}
            {/*      <FormLabel required>Xavfli ishlab chiqarish obyekti</FormLabel>*/}
            {/*      <Select onValueChange={field.onChange} value={field.value} disabled={isHfLoading}>*/}
            {/*        <FormControl>*/}
            {/*          <SelectTrigger>*/}
            {/*            <SelectValue placeholder="XICHO'ni tanlang" />*/}
            {/*          </SelectTrigger>*/}
            {/*        </FormControl>*/}
            {/*        <SelectContent>{getSelectOptions(hfOptions || [])}</SelectContent>*/}
            {/*      </Select>*/}
            {/*      <FormMessage />*/}
            {/*    </FormItem>*/}
            {/*  )}*/}
            {/*/>*/}
            <FormField
              control={form.control}
              name="hfRegistryNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>XICHOning hisobga olish raqami</FormLabel>
                  <FormControl>
                    <Input placeholder="Hisobga olish raqamini kiriting" {...field} />
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
                    <Input placeholder="Tashkilot nomini kiriting" {...field} />
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
                    <Input placeholder="Foydalanuvchi tashkilot nomini kiriting" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="legalAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>XICHОdan foydalanuvchi tashkilotning pochta manzili</FormLabel>
                  <FormControl>
                    <Input placeholder="Pochta manzilini kiriting" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>STIR</FormLabel>
                  <FormControl>
                    <Input placeholder="STIRni kiriting" {...field} />
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
                    <Input placeholder="XICHO nomini kiriting" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hfAddress"
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
          </CardContent>
        </Card>

        {/* XODIMLAR HAQIDA MA'LUMOT KARTASI */}
        <Card>
          <CardHeader>
            <CardTitle>Attestatsiyadan o'tkaziladigan xodimlar to'g'risida ma'lumot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((item, index) => (
              <div key={item.id} className="border p-4 rounded-md space-y-4 relative">
                <div className="flex justify-end absolute top-2 right-2">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => remove(index)}
                    disabled={index === 0}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name={`employeeList.${index}.pin`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>JSHSHIR</FormLabel>
                        <FormControl>
                          <Input placeholder="JSHSHIRni kiriting" {...field} />
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
                          <Input placeholder="F.I.SH.ni kiriting" {...field} />
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
                        <FormLabel>'Kontekhnazorat' DUKda o‘qigan muddati</FormLabel>
                        <FormControl>
                          <DatePicker
                            value={field.value ? new Date(field.value) : undefined}
                            onChange={(date) => field.onChange(date)}
                            placeholder="dan"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`employeeList.${index}.ctcTrainingDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>'Kontekhnazorat' DUKda o‘qigan muddati</FormLabel>
                        <FormControl>
                          <DatePicker
                            value={field.value ? new Date(field.value) : undefined}
                            onChange={(date) => field.onChange(date)}
                            placeholder="gacha"
                          />
                        </FormControl>
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
                        <FormControl>
                          <DatePicker
                            value={field.value ? new Date(field.value) : undefined}
                            onChange={(date) => field.onChange(date)}
                            placeholder="Sanani tanlang"
                          />
                        </FormControl>
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
                        <FormControl>
                          <DatePicker
                            value={field.value ? new Date(field.value) : undefined}
                            onChange={(date) => field.onChange(date)}
                            placeholder="Sanani tanlang"
                          />
                        </FormControl>
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
                        <FormControl>
                          <DatePicker
                            value={field.value ? new Date(field.value) : undefined}
                            onChange={(date) => field.onChange(date)}
                            placeholder="Sanani tanlang"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addEmployee}>
              <PlusCircle className="mr-2 h-4 w-4" /> Attestatsiyaga xodim qo‘shish
            </Button>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export default RegisterAttestationForm;
