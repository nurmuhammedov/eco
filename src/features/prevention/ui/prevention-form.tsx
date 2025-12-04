import { CardForm } from '@/entities/create-application'
import { GoBack } from '@/shared/components/common'
import { InputFile } from '@/shared/components/common/file-upload'
import { Button } from '@/shared/components/ui/button'
import DatePicker from '@/shared/components/ui/datepicker'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Textarea } from '@/shared/components/ui/textarea'
import { format } from 'date-fns'
import { FC } from 'react'
import { useParams } from 'react-router-dom'
import { usePreventionForm } from '../model/use-prevention-form'

export const PreventionForm: FC = () => {
  const { form, onSubmit, isPending, isLoadingTypes, preventionTypesOptions } = usePreventionForm()
  const { tin = undefined } = useParams()
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <GoBack title={`Profilaktika tadbirini o'tkazish - ${tin} (STIR)`} />
        <CardForm>
          <div className="mt-4 grid gap-4 lg:grid-cols-1 xl:grid-cols-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Profilaktika tadbiri o'tkazilgan sana</FormLabel>
                  <FormControl>
                    <DatePicker
                      value={field.value ? new Date(field.value) : undefined}
                      onChange={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="typeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Profilaktika tadbiri shakli</FormLabel>
                  <Select onValueChange={(value) => field.onChange(Number(value))} disabled={isLoadingTypes}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Shaklni tanlang" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>{preventionTypesOptions}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel required>Profilaktika tadbiri mazmuni</FormLabel>
                <FormControl>
                  <Textarea rows={5} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-4 grid gap-4 lg:grid-cols-1 xl:grid-cols-4">
            <FormField
              control={form.control}
              name="eventFilePath"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Profilaktika tadbiri fayli</FormLabel>
                  <FormControl>
                    <InputFile form={form} name={field.name} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="organizationFilePath"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Tashkilotga taaluqli fayl</FormLabel>
                  <FormControl>
                    <InputFile form={form} name={field.name} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </CardForm>
        <Button type="submit" loading={isPending}>
          Saqlash
        </Button>
      </form>
    </Form>
  )
}
