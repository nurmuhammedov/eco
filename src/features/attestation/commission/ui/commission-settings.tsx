import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent } from '@/shared/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import type { AttestationCommission } from '@/entities/attestation/model/types'
import { useUpdateCommission } from '../model/use-commission'

const schema = z.object({
  name: z.string().trim().min(1).max(500),
  organization_name: z.string().trim().min(1).max(500),
  order_details: z.string().trim().max(500),
  city: z.string().trim().min(1).max(255),
  address: z.string().trim().min(1).max(500),
  phone: z.string().trim().max(100),
})

type FormValues = z.infer<typeof schema>

type FieldName = keyof FormValues

const FIELDS: { name: FieldName; label: string; hint?: string; placeholder?: string; required?: boolean }[] = [
  {
    name: 'organization_name',
    label: 'Hujjatlarni beruvchi organ',
    hint: 'Xat blankasida, qaror va guvohnomada yoziladi',
    required: true,
  },
  { name: 'name', label: 'Komissiya nomi', hint: 'Bayonnoma va guvohnomada yoziladi', required: true },
  {
    name: 'order_details',
    label: 'Komissiyani tasdiqlagan buyruq',
    placeholder: '2026-yil 12-fevraldagi 01/15-69-sonli buyrug‘i',
    hint: 'Bayonnoma yuborish xatida keltiriladi',
  },
  { name: 'city', label: 'Shahar (tuman)', placeholder: 'Toshkent shahri', required: true },
  {
    name: 'address',
    label: 'Attestatsiya o‘tkaziladigan joy',
    hint: 'Imtihon belgilashda standart joy sifatida taklif qilinadi',
    required: true,
  },
  { name: 'phone', label: 'Ijrochi telefoni', placeholder: '71 203 02 39 (17)' },
]

const toValues = (commission: AttestationCommission): FormValues => ({
  name: commission.name,
  organization_name: commission.organization_name,
  order_details: commission.order_details ?? '',
  city: commission.city ?? '',
  address: commission.address ?? '',
  phone: commission.phone ?? '',
})

/** The commission's own details: everything its documents print besides the members */
export function CommissionSettings({ commission }: { commission: AttestationCommission }) {
  const update = useUpdateCommission()
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: toValues(commission) })

  useEffect(() => {
    form.reset(toValues(commission))
  }, [commission, form])

  const onSubmit = (values: FormValues) =>
    update.mutate({
      ...values,
      order_details: values.order_details || null,
      phone: values.phone || null,
    })

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="mb-4 text-base font-semibold">Komissiya ma’lumotlari</h3>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {FIELDS.map((item) => (
                <FormField
                  key={item.name}
                  name={item.name}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required={item.required}>{item.label}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={item.placeholder} />
                      </FormControl>
                      {item.hint && <FormDescription>{item.hint}</FormDescription>}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            <div className="flex justify-end">
              <Button type="submit" loading={update.isPending} disabled={update.isPending}>
                Saqlash
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
