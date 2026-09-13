import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ColumnDef } from '@tanstack/react-table'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { DataTable } from '@/shared/components/common/data-table/data-table'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { useOrgWorkflowMutation, useProcessParticipants } from '../api'
import { PROCESS_TYPE, ProcessParticipant, SLOTS } from '../model/types'
import { OrgSelect } from './org-select'
import { ActiveBadge, ConfirmButton, FormSheet, TabToolbar } from './shared'

const schema = z.object({
  slot: z.enum(SLOTS, { required_error: FORM_ERROR_MESSAGES.required }),
  orgId: z.string().min(1, FORM_ERROR_MESSAGES.required),
})

type Values = z.infer<typeof schema>

export const ProcessParticipantsTab = () => {
  const [open, setOpen] = useState(false)
  const { data, isLoading } = useProcessParticipants()
  const { mutate, isPending } = useOrgWorkflowMutation()

  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { orgId: '' } })

  const columns: ColumnDef<ProcessParticipant>[] = [
    { accessorKey: 'slot', header: 'Ishtirok o‘rni' },
    { accessorKey: 'orgName', header: 'Tashkilot' },
    {
      accessorKey: 'isActive',
      header: 'Holati',
      cell: ({ row }) => <ActiveBadge active={row.original.isActive} />,
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Amallar</div>,
      cell: ({ row }) =>
        row.original.isActive ? (
          <div className="flex justify-end">
            <ConfirmButton
              label="Nofaol qilish"
              title="Ishtirokchini nofaol qilasizmi?"
              description="Yangi pasportlar bu tashkilotga ko‘rib chiqish uchun yuborilmaydi."
              disabled={isPending}
              onConfirm={() =>
                mutate({
                  method: 'put',
                  url: `/process-participants/${row.original.id}/deactivate`,
                  success: 'Ishtirokchi nofaol qilindi',
                })
              }
            />
          </div>
        ) : null,
    },
  ]

  const onSubmit = (values: Values) =>
    mutate(
      {
        method: 'post',
        url: '/process-participants',
        body: { processType: PROCESS_TYPE, ...values },
        success: 'Ishtirokchi biriktirildi',
      },
      { onSuccess: () => setOpen(false) }
    )

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <TabToolbar
        addLabel="Ishtirokchi biriktirish"
        onAdd={() => {
          form.reset({ orgId: '' })
          setOpen(true)
        }}
      />

      <DataTable columns={columns} data={data ?? []} isLoading={isLoading} isPaginated={false} className="flex-1" />

      <FormSheet
        open={open}
        onOpenChange={setOpen}
        title="Jarayon ishtirokchisini biriktirish"
        form={form}
        onSubmit={onSubmit}
        isPending={isPending}
      >
        <FormField
          control={form.control}
          name="slot"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Ishtirok o‘rni</FormLabel>
              <Select value={field.value || ''} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Tanlang" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {SLOTS.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
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
          name="orgId"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Tashkilot</FormLabel>
              <FormControl>
                <OrgSelect onlyActive value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </FormSheet>
    </div>
  )
}
