import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ColumnDef } from '@tanstack/react-table'
import { Input } from '@/shared/components/ui/input'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { DataTable } from '@/shared/components/common/data-table/data-table'
import { useCustomSearchParams } from '@/shared/hooks'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { useOrgPositions, useOrgWorkflowMutation, usePartnerOrgs } from '../api'
import { OrgPosition } from '../model/types'
import { OrgSelect } from './org-select'
import { EmptyHint, FormSheet, TabToolbar } from './shared'

const schema = z.object({
  code: z.string().trim().min(1, FORM_ERROR_MESSAGES.required),
  name: z.string().trim().min(1, FORM_ERROR_MESSAGES.required),
})

type Values = z.infer<typeof schema>

const DEFAULTS: Values = { code: '', name: '' }

const columns: ColumnDef<OrgPosition>[] = [
  { accessorKey: 'code', header: 'Kodi' },
  { accessorKey: 'name', header: 'Lavozim nomi' },
]

export const OrgPositionsTab = () => {
  const {
    paramsObject: { orgId = '' },
    addParams,
  } = useCustomSearchParams()

  const [open, setOpen] = useState(false)
  const { data: orgs } = usePartnerOrgs()
  const { data, isLoading } = useOrgPositions(String(orgId) || undefined)
  const { mutate, isPending } = useOrgWorkflowMutation()

  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: DEFAULTS })

  const onSubmit = (values: Values) =>
    mutate(
      { method: 'post', url: '/org-positions', body: { orgId, ...values }, success: 'Lavozim qo‘shildi' },
      { onSuccess: () => setOpen(false) }
    )

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <TabToolbar
        addLabel="Lavozim qo‘shish"
        addDisabled={!orgId}
        onAdd={() => {
          form.reset(DEFAULTS)
          setOpen(true)
        }}
      >
        <OrgSelect value={String(orgId)} onChange={(value) => addParams({ orgId: value })} className="w-64" />
      </TabToolbar>

      {orgId ? (
        <DataTable columns={columns} data={data ?? []} isLoading={isLoading} isPaginated={false} className="flex-1" />
      ) : (
        <EmptyHint>
          {orgs?.length
            ? 'Lavozimlarni ko‘rish uchun tashkilotni tanlang'
            : 'Avval «Tashkilotlar» bo‘limida hamkor tashkilot qo‘shing'}
        </EmptyHint>
      )}

      <FormSheet
        open={open}
        onOpenChange={setOpen}
        title="Lavozim qo‘shish"
        form={form}
        onSubmit={onSubmit}
        isPending={isPending}
      >
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Kodi</FormLabel>
              <FormControl>
                <Input placeholder="Masalan: EXECUTOR" maxLength={50} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Lavozim nomi</FormLabel>
              <FormControl>
                <Input placeholder="Masalan: Ijrochi" maxLength={255} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </FormSheet>
    </div>
  )
}
