// src/features/attestation/ui/add-employee-form.tsx

import { GoBack } from '@/shared/components/common'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import DatePicker from '@/shared/components/ui/datepicker'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { getSelectOptions } from '@/shared/lib/get-select-options'
import { PlusCircle, Trash2 } from 'lucide-react'
import { useAddEmployeeForm } from '../hooks/use-add-employee-form'

export const AddEmployeeForm = () => {
  const { form, fields, addEmployee, remove, hfOptions, employeeLevelOptions, isLoadingHf, onSubmit, isPending } =
    useAddEmployeeForm()

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <div className="mb-4 flex items-center justify-between">
          <GoBack title="Attestatsiyaga xodim qo'shish" />
          <Button onClick={onSubmit} loading={isPending}>
            Saqlash
          </Button>
        </div>
        <Card className="mb-4">
          <CardContent className="mt-4">
            <FormField
              control={form.control}
              name="hfId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>XICHOni tanlang</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={isLoadingHf}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="XICHOni tanlang" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>{getSelectOptions(hfOptions || [])}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {fields.map((field, index) => (
          <Card key={field.id} className="mb-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Xodim #{index + 1}</CardTitle>
              <Button
                variant="destructive"
                size="icon"
                type="button"
                onClick={() => remove(index)}
                disabled={index === 0}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <FormField
                control={form.control}
                name={`employeeList.${index}.pin`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>JSHSHIR</FormLabel>
                    <FormControl>
                      <Input placeholder="JSHSHIR" {...field} />
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
                      <Input placeholder="F.I.SH" {...field} />
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
                      <Input placeholder="Lavozimi" {...field} />
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
                      onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
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
                      onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
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
                      <Input placeholder="Sertifikat raqami" {...field} />
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
                      onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
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
                      onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
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
                      onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
                      placeholder="Sanani tanlang"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        ))}

        <div className="mt-4 flex justify-between">
          <Button type="button" onClick={addEmployee}>
            <PlusCircle className="mr-2 h-4 w-4" /> Xodim qo‘shish
          </Button>
        </div>
      </form>
    </Form>
  )
}
