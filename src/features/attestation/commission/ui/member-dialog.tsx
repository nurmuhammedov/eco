import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import DatePicker from '@/shared/components/ui/datepicker'
import { lookupCitizen } from '@/shared/api/citizen-lookup'
import { COMMISSION_ROLE_OPTIONS } from '@/entities/attestation/model/labels'
import type { AttestationCommissionMember, CommissionRole } from '@/entities/attestation/model/types'
import { useAddCommissionMember, useUpdateCommissionMember } from '../model/use-commission'

const schema = z.object({
  pin: z.string().regex(/^\d{14}$/),
  birthDate: z.date().optional(),
  full_name: z.string().min(1),
  position: z.string().trim().min(1).max(500),
  role: z.enum(['CHAIRMAN', 'DEPUTY', 'MEMBER', 'SECRETARY']),
})

type FormValues = z.infer<typeof schema>

interface Props {
  isOpen: boolean
  onClose: () => void
  /** Editing keeps the person and changes only their position and role */
  member?: AttestationCommissionMember | null
}

const emptyValues = (): FormValues => ({
  pin: '',
  birthDate: undefined,
  full_name: '',
  position: '',
  role: 'MEMBER',
})

/** A member is found in the state register by PINFL and birth date, so the name is never typed by hand */
export function MemberDialog({ isOpen, onClose, member }: Props) {
  const isEditing = !!member
  const [isSearching, setIsSearching] = useState(false)

  const add = useAddCommissionMember()
  const update = useUpdateCommissionMember()
  const isPending = add.isPending || update.isPending

  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: emptyValues() })
  const [pin, birthDate, fullName] = form.watch(['pin', 'birthDate', 'full_name'])

  useEffect(() => {
    if (!isOpen) return

    form.reset(
      member
        ? {
            pin: member.pin,
            birthDate: undefined,
            full_name: member.full_name,
            position: member.position ?? '',
            role: member.role,
          }
        : emptyValues()
    )
  }, [isOpen, member, form])

  const search = async () => {
    if (!birthDate) return

    setIsSearching(true)
    const citizen = await lookupCitizen(pin, birthDate)
    setIsSearching(false)

    form.setValue('full_name', citizen?.fullName ?? '', { shouldValidate: true })
  }

  const onSubmit = (values: FormValues) => {
    const done = { onSuccess: onClose }

    if (member) {
      update.mutate({ id: member.id, position: values.position, role: values.role }, done)
    } else {
      add.mutate({ pin: values.pin, full_name: values.full_name, position: values.position, role: values.role }, done)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Komissiya a’zosini tahrirlash' : 'Komissiya a’zosini qo‘shish'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {!isEditing && (
              <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
                <FormField
                  name="pin"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>JSHSHIR</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          inputMode="numeric"
                          maxLength={14}
                          placeholder="12345678901234"
                          onChange={(event) => {
                            field.onChange(event.target.value.replace(/\D/g, ''))
                            form.setValue('full_name', '')
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="birthDate"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Tug‘ilgan sana</FormLabel>
                      <FormControl>
                        <DatePicker
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value)
                            form.setValue('full_name', '')
                          }}
                          disableStrategy="after"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  disabled={pin.length !== 14 || !birthDate}
                  loading={isSearching}
                  onClick={() => void search()}
                >
                  Qidirish
                </Button>
              </div>
            )}

            <FormField
              name="full_name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>F.I.Sh.</FormLabel>
                  <FormControl>
                    <Input {...field} disabled placeholder="Davlat reyestridan olinadi" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="position"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Lavozimi</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Masalan: Qo‘mita raisining birinchi o‘rinbosari" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="role"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Komissiyadagi vazifasi</FormLabel>
                  <Select value={field.value} onValueChange={(value) => field.onChange(value as CommissionRole)}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Tanlang" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {COMMISSION_ROLE_OPTIONS.map((option) => (
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

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                Bekor qilish
              </Button>
              <Button type="submit" disabled={isPending || !fullName} loading={isPending}>
                Saqlash
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
