import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { DataTable } from '@/shared/components/common/data-table/data-table'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { useOrgWorkflowMutation, usePartnerOrgs } from '../api'
import { PartnerOrg } from '../model/types'
import { ActiveBadge, FormSheet, TabToolbar } from './shared'

const schema = z.object({
  tin: z.string().regex(/^\d{9}$/, FORM_ERROR_MESSAGES.invalid),
  code: z.string().trim().min(1, FORM_ERROR_MESSAGES.required),
})

type Values = z.infer<typeof schema>

const DEFAULTS: Values = { tin: '', code: '' }

export const PartnerOrgsTab = () => {
  const [open, setOpen] = useState(false)
  const { data, isLoading } = usePartnerOrgs()
  const { mutate, isPending } = useOrgWorkflowMutation()

  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: DEFAULTS })

  const columns: ColumnDef<PartnerOrg>[] = [
    { accessorKey: 'code', header: 'Kodi' },
    { accessorKey: 'name', header: 'Tashkilot nomi' },
    { accessorKey: 'tin', header: 'STIR' },
    {
      accessorKey: 'isActive',
      header: 'Holati',
      cell: ({ row }) => <ActiveBadge active={row.original.isActive} />,
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Amallar</div>,
      cell: ({ row }) => {
        const { id, isActive } = row.original

        return (
          <div className="flex justify-end">
            <Button
              size="sm"
              variant="outline"
              disabled={isPending}
              onClick={() =>
                mutate({
                  method: 'put',
                  url: `/partner-orgs/${id}/${isActive ? 'deactivate' : 'activate'}`,
                  success: isActive ? 'Tashkilot nofaol qilindi' : 'Tashkilot faollashtirildi',
                })
              }
            >
              {isActive ? 'Nofaol qilish' : 'Faollashtirish'}
            </Button>
          </div>
        )
      },
    },
  ]

  const onSubmit = (values: Values) =>
    mutate(
      {
        method: 'post',
        url: '/partner-orgs',
        body: { tin: Number(values.tin), code: values.code.trim() },
        success: 'Tashkilot qo‘shildi',
      },
      { onSuccess: () => setOpen(false) }
    )

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <TabToolbar
        addLabel="Tashkilot qo‘shish"
        onAdd={() => {
          form.reset(DEFAULTS)
          setOpen(true)
        }}
      />

      <DataTable columns={columns} data={data ?? []} isLoading={isLoading} isPaginated={false} className="flex-1" />

      <FormSheet
        open={open}
        onOpenChange={setOpen}
        title="Hamkor tashkilot qo‘shish"
        form={form}
        onSubmit={onSubmit}
        isPending={isPending}
      >
        <FormField
          control={form.control}
          name="tin"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Tashkilot STIR</FormLabel>
              <FormControl>
                <Input
                  placeholder="9 xonali STIR"
                  inputMode="numeric"
                  maxLength={9}
                  {...field}
                  onChange={(event) => field.onChange(event.target.value.replace(/\D/g, ''))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Kodi</FormLabel>
              <FormControl>
                <Input placeholder="Masalan: FVV" maxLength={50} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </FormSheet>
    </div>
  )
}
