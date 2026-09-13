import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { ColumnDef } from '@tanstack/react-table'
import { Input } from '@/shared/components/ui/input'
import DatePicker from '@/shared/components/ui/datepicker'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { DataTable } from '@/shared/components/common/data-table/data-table'
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { useOrgWorkflowMutation } from '../api'
import { OrgEmployee } from '../model/types'
import { OrgSelect, PositionSelect } from './org-select'
import { ActiveBadge, ConfirmButton, FormSheet, TabToolbar } from './shared'

const { required, invalid } = FORM_ERROR_MESSAGES

const schema = z.object({
  orgId: z.string().min(1, required),
  positionId: z.string().min(1, required),
  pin: z.string().regex(/^\d{14}$/, invalid),
  birthDate: z.date({ required_error: required, invalid_type_error: invalid }),
})

type Values = z.infer<typeof schema>

const ACTIVITY_ALL = 'ALL'

export const OrgEmployeesTab = () => {
  const {
    paramsObject: { page = 1, size = 10, orgId = '', positionId = '', isActive = '' },
    addParams,
  } = useCustomSearchParams()

  const [open, setOpen] = useState(false)
  const { mutate, isPending } = useOrgWorkflowMutation()

  const { data, isLoading, totalPages } = usePaginatedData<OrgEmployee>('/org-employees', {
    page,
    size,
    orgId,
    positionId,
    isActive,
  })

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { orgId: '', positionId: '', pin: '' },
  })

  const formOrgId = useWatch({ control: form.control, name: 'orgId' })

  const columns: ColumnDef<OrgEmployee>[] = [
    { accessorKey: 'fullName', header: 'F.I.SH.' },
    { accessorKey: 'pin', header: 'JSHSHIR' },
    { accessorKey: 'orgName', header: 'Tashkilot' },
    { accessorKey: 'positionName', header: 'Lavozim' },
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
              title="Xodimni nofaol qilasizmi?"
              description="Lavozimini o‘zgartirish uchun avval nofaol qilib, keyin yangi lavozimga qayta qo‘shiladi."
              disabled={isPending}
              onConfirm={() =>
                mutate({
                  method: 'put',
                  url: `/org-employees/${row.original.id}/deactivate`,
                  success: 'Xodim nofaol qilindi',
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
        url: '/org-employees',
        body: {
          orgId: values.orgId,
          positionId: values.positionId,
          pin: Number(values.pin),
          birthDate: format(values.birthDate, 'yyyy-MM-dd'),
        },
        success: 'Xodim qo‘shildi',
      },
      { onSuccess: () => setOpen(false) }
    )

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <TabToolbar
        addLabel="Xodim qo‘shish"
        onAdd={() => {
          form.reset({ orgId: String(orgId), positionId: '', pin: '' })
          setOpen(true)
        }}
      >
        <OrgSelect
          value={String(orgId)}
          allLabel="Barcha tashkilotlar"
          onChange={(value) => addParams({ orgId: value }, 'page', 'positionId')}
          className="w-56"
        />
        <PositionSelect
          orgId={String(orgId)}
          value={String(positionId)}
          allLabel="Barcha lavozimlar"
          onChange={(value) => addParams({ positionId: value }, 'page')}
          className="w-48"
        />
        <Select
          value={String(isActive) || ACTIVITY_ALL}
          onValueChange={(value) => addParams({ isActive: value === ACTIVITY_ALL ? '' : value }, 'page')}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ACTIVITY_ALL}>Barchasi</SelectItem>
            <SelectItem value="true">Faol</SelectItem>
            <SelectItem value="false">Nofaol</SelectItem>
          </SelectContent>
        </Select>
      </TabToolbar>

      <DataTable
        isPaginated
        columns={columns}
        data={data?.content || []}
        isLoading={isLoading}
        pageCount={totalPages}
        className="flex-1"
      />

      <FormSheet
        open={open}
        onOpenChange={setOpen}
        title="Xodim qo‘shish"
        form={form}
        onSubmit={onSubmit}
        isPending={isPending}
      >
        <FormField
          control={form.control}
          name="orgId"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Tashkilot</FormLabel>
              <FormControl>
                <OrgSelect
                  onlyActive
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value)
                    form.setValue('positionId', '')
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="positionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Lavozim</FormLabel>
              <FormControl>
                <PositionSelect orgId={formOrgId} value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>JSHSHIR</FormLabel>
              <FormControl>
                <Input
                  placeholder="14 xonali JSHSHIR"
                  inputMode="numeric"
                  maxLength={14}
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
          name="birthDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Tug‘ilgan sanasi</FormLabel>
              <DatePicker
                value={field.value}
                onChange={field.onChange}
                placeholder="Sanani tanlang"
                disableStrategy="after"
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </FormSheet>
    </div>
  )
}
