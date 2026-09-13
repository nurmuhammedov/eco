import { useState } from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { useCustomSearchParams } from '@/shared/hooks'
import { cn } from '@/shared/lib/utils'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { useOrgWorkflowMutation, usePartnerOrgs, useWorkflowDefinitions } from '../api'
import { ACTION_LABELS, PROCESS_TYPE, WORKFLOW_ACTIONS, WorkflowDefinition } from '../model/types'
import { OrgSelect, PositionSelect } from './org-select'
import { ActiveBadge, ConfirmButton, EmptyHint, FormSheet, TabToolbar } from './shared'

const { required } = FORM_ERROR_MESSAGES

const stepSchema = z.object({
  positionId: z.string().min(1, required),
  allowedActions: z.array(z.enum(WORKFLOW_ACTIONS)).min(1, 'Kamida bitta amalni belgilang'),
  returnToStep: z.string().optional(),
})

const schema = z.object({ steps: z.array(stepSchema).min(1) }).superRefine(({ steps }, ctx) => {
  steps.forEach((step, index) => {
    if (step.allowedActions.includes('RETURN') && !step.returnToStep) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['steps', index, 'returnToStep'], message: required })
    }
  })
})

type Values = z.infer<typeof schema>

const emptyStep = (): Values['steps'][number] => ({ positionId: '', allowedActions: [], returnToStep: '' })

const byOrder = <T extends { stepOrder: number }>(steps: T[]) => [...steps].sort((a, b) => a.stepOrder - b.stepOrder)

// A new version starts from the active one, since it is usually a small change to it.
const toFormSteps = (definition?: WorkflowDefinition): Values['steps'] =>
  definition?.steps?.length
    ? byOrder(definition.steps).map((step) => ({
        positionId: step.positionId,
        allowedActions: [...step.allowedActions],
        returnToStep: step.returnToStep ? String(step.returnToStep) : '',
      }))
    : [emptyStep()]

export const WorkflowDefinitionsTab = () => {
  const {
    paramsObject: { orgId = '' },
    addParams,
  } = useCustomSearchParams()

  const [open, setOpen] = useState(false)
  const { data: orgs } = usePartnerOrgs()
  const { data, isLoading } = useWorkflowDefinitions(String(orgId) || undefined)
  const { mutate, isPending } = useOrgWorkflowMutation()

  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { steps: [emptyStep()] } })
  const { fields, append, remove, move } = useFieldArray({ control: form.control, name: 'steps' })
  const steps = useWatch({ control: form.control, name: 'steps' })

  const definitions = [...(data ?? [])].sort((a, b) => b.version - a.version)
  const active = definitions.find((definition) => definition.isActive)

  const onSubmit = (values: Values) =>
    mutate(
      {
        method: 'post',
        url: '/workflow-definitions',
        body: {
          processType: PROCESS_TYPE,
          orgId,
          steps: values.steps.map((step, index) => ({
            stepOrder: index + 1,
            positionId: step.positionId,
            allowedActions: step.allowedActions,
            ...(step.allowedActions.includes('RETURN') ? { returnToStep: Number(step.returnToStep) } : {}),
          })),
        },
        success: 'Yangi versiya yaratildi',
      },
      { onSuccess: () => setOpen(false) }
    )

  const content = () => {
    if (!orgId)
      return (
        <EmptyHint>
          {orgs?.length
            ? 'Pog‘onalarni ko‘rish uchun tashkilotni tanlang'
            : 'Avval «Tashkilotlar» bo‘limida hamkor tashkilot qo‘shing'}
        </EmptyHint>
      )
    if (isLoading) return <EmptyHint>Yuklanmoqda...</EmptyHint>
    if (!definitions.length) return <EmptyHint>Bu tashkilot uchun jarayon pog‘onalari hali belgilanmagan</EmptyHint>

    return (
      <div className="space-y-3">
        {definitions.map((definition) => (
          <div key={definition.id} className="rounded-xl border border-neutral-200 bg-white p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-neutral-900">{definition.version}-versiya</span>
                <ActiveBadge active={definition.isActive} />
              </div>
              {definition.isActive && (
                <ConfirmButton
                  label="Nofaol qilish"
                  title="Versiyani nofaol qilasizmi?"
                  description="Jarayondagi pasportlar shu versiyada yakunlanadi, yangi pasportlar uchun esa faol versiya qolmaydi."
                  disabled={isPending}
                  onConfirm={() =>
                    mutate({
                      method: 'put',
                      url: `/workflow-definitions/${definition.id}/deactivate`,
                      success: 'Versiya nofaol qilindi',
                    })
                  }
                />
              )}
            </div>
            <ol className="space-y-2">
              {byOrder(definition.steps).map((step) => (
                <li key={step.stepOrder} className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-xs font-semibold">
                    {step.stepOrder}
                  </span>
                  <span className="font-medium text-neutral-900">{step.positionName || '-'}</span>
                  {step.allowedActions.map((action) => (
                    <Badge key={action} variant="outline">
                      {ACTION_LABELS[action] ?? action}
                    </Badge>
                  ))}
                  {step.returnToStep && (
                    <span className="text-muted-foreground text-xs">{step.returnToStep}-pog‘onaga qaytaradi</span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
      <TabToolbar
        addLabel="Yangi versiya"
        addDisabled={!orgId}
        onAdd={() => {
          form.reset({ steps: toFormSteps(active) })
          setOpen(true)
        }}
      >
        <OrgSelect value={String(orgId)} onChange={(value) => addParams({ orgId: value })} className="w-64" />
      </TabToolbar>

      {content()}

      <FormSheet
        open={open}
        onOpenChange={setOpen}
        title="Jarayon pog‘onalarining yangi versiyasi"
        form={form}
        onSubmit={onSubmit}
        isPending={isPending}
        className="w-full sm:max-w-2xl"
      >
        {fields.map((item, index) => {
          const selected = steps?.[index]?.allowedActions ?? []

          return (
            <div key={item.id} className="space-y-3 rounded-xl border border-neutral-200 p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-neutral-900">{index + 1}-pog‘ona</span>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    disabled={index === 0}
                    onClick={() => move(index, index - 1)}
                  >
                    <ArrowUp className="size-4" />
                    <span className="sr-only">Yuqoriga</span>
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    disabled={index === fields.length - 1}
                    onClick={() => move(index, index + 1)}
                  >
                    <ArrowDown className="size-4" />
                    <span className="sr-only">Pastga</span>
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    disabled={fields.length === 1}
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="size-4 text-red-500" />
                    <span className="sr-only">O‘chirish</span>
                  </Button>
                </div>
              </div>

              <FormField
                control={form.control}
                name={`steps.${index}.positionId`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Lavozim</FormLabel>
                    <FormControl>
                      <PositionSelect orgId={String(orgId)} value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`steps.${index}.allowedActions`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Amallar</FormLabel>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {WORKFLOW_ACTIONS.map((action) => {
                        const current = field.value ?? []
                        const disabled = action === 'RETURN' && index === 0

                        return (
                          <label
                            key={action}
                            className={cn('flex cursor-pointer items-center gap-2 text-sm', disabled && 'opacity-50')}
                          >
                            <Checkbox
                              checked={current.includes(action)}
                              disabled={disabled}
                              onCheckedChange={(checked) =>
                                field.onChange(
                                  checked ? [...current, action] : current.filter((value) => value !== action)
                                )
                              }
                            />
                            {ACTION_LABELS[action]}
                          </label>
                        )
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selected.includes('RETURN') && index > 0 && (
                <FormField
                  control={form.control}
                  name={`steps.${index}.returnToStep`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Qaysi pog‘onaga qaytaradi</FormLabel>
                      <Select value={field.value || ''} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Tanlang" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: index }, (_, order) => (
                            <SelectItem key={order + 1} value={String(order + 1)}>
                              {order + 1}-pog‘ona
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          )
        })}

        <Button type="button" variant="outline" className="w-full" onClick={() => append(emptyStep())}>
          <Plus className="mr-2 size-4" />
          Pog‘ona qo‘shish
        </Button>
      </FormSheet>
    </div>
  )
}
