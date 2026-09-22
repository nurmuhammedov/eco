import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, ClipboardPen, Loader2, ShieldCheck, UserRound } from 'lucide-react'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Label } from '@/shared/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { Switch } from '@/shared/components/ui/switch'
import { cn } from '@/shared/lib/utils'
import { useKpiApproverCandidates, useKpiApprovers, useSaveKpiApprovers } from '../model/use-kpi-approvers'

const SLOTS = [0, 1] as const

const initials = (name?: string) =>
  (name ?? '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || '—'

export const KpiApproversPage = () => {
  const { data: approvers, isLoading } = useKpiApprovers()
  const { data: candidates = [], isLoading: isLoadingCandidates } = useKpiApproverCandidates()
  const saveMutation = useSaveKpiApprovers()

  const [selected, setSelected] = useState<string[]>(['', ''])
  const [assignerId, setAssignerId] = useState('')

  useEffect(() => {
    if (!approvers?.length) return

    setSelected([approvers[0]?.user_id ?? '', approvers[1]?.user_id ?? ''])
    setAssignerId(approvers.find((item) => item.can_assign)?.user_id ?? '')
  }, [approvers])

  const byId = useMemo(() => new Map(candidates.map((user) => [user.id, user])), [candidates])

  const pick = (slot: number, userId: string) => {
    setSelected((current) => current.map((value, index) => (index === slot ? userId : value)))

    // The duty follows the seat: replacing the assigner keeps the task with it.
    if (assignerId && assignerId === selected[slot]) setAssignerId(userId)
  }

  const isComplete = selected.every(Boolean) && selected[0] !== selected[1] && selected.includes(assignerId)

  const handleSave = () =>
    saveMutation.mutate({
      approvers: selected.map((userId) => ({ user_id: userId, can_assign: userId === assignerId })),
    })

  if (isLoading || isLoadingCandidates) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-24 w-full rounded-xl" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-52 rounded-xl" />
          <Skeleton className="h-52 rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldCheck className="text-teal h-5 w-5" />
            KPI tasdiqlovchilari
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1 pt-0 text-sm">
          <span>Natijani</span>
          <Badge variant="secondary" className="font-semibold">
            ikki kishi
          </Badge>
          <span>tasdiqlaydi.</span>
          <ArrowRight className="h-3.5 w-3.5 opacity-50" />
          <span>Ulardan</span>
          <Badge variant="info" className="gap-1 font-semibold">
            <ClipboardPen className="h-3 w-3" />
            bittasi
          </Badge>
          <span>KPI vazifalarini ham kiritadi. Tasdiqlovchilar o‘z natijalarini kirita olmaydi.</span>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {SLOTS.map((slot) => {
          const otherId = selected[slot === 0 ? 1 : 0]
          const options = candidates.filter((user) => user.id !== otherId)
          const chosen = byId.get(selected[slot])
          const isAssigner = !!selected[slot] && selected[slot] === assignerId

          return (
            <Card key={slot} className={cn('transition-colors', isAssigner && 'border-teal/50 bg-teal/[0.03]')}>
              <CardHeader className="pb-3">
                <CardTitle className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  {slot + 1}-tasdiqlovchi
                </CardTitle>
              </CardHeader>

              <CardContent className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
                      chosen ? 'bg-teal text-white' : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {chosen ? initials(chosen.name) : <UserRound className="h-5 w-5" />}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{chosen?.name ?? 'Tanlanmagan'}</p>
                    <p className="text-muted-foreground truncate text-xs">
                      {chosen ? `JSHSHIR: ${chosen.username}` : 'Mas’ul bo‘lim boshlig‘ini tanlang'}
                    </p>
                  </div>
                </div>

                <Select value={selected[slot]} onValueChange={(value) => pick(slot, value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Xodimni tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {options.length ? (
                      options.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        Mavjud emas
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>

                <div className="flex items-center justify-between gap-3 rounded-md border px-3 py-2">
                  <Label
                    htmlFor={`assigner-${slot}`}
                    className="flex cursor-pointer items-center gap-2 text-sm font-normal"
                  >
                    <ClipboardPen className={cn('h-4 w-4', isAssigner ? 'text-teal' : 'text-muted-foreground')} />
                    Vazifalarni ham shu kiritadi
                  </Label>
                  {/* The duty belongs to exactly one of the two, so turning it
                      on here is what turns it off on the other card. */}
                  <Switch
                    id={`assigner-${slot}`}
                    checked={isAssigner}
                    disabled={!selected[slot]}
                    onChange={(event) => event.target.checked && setAssignerId(selected[slot])}
                  />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3">
        {!isComplete && (
          <span className="text-muted-foreground text-sm">
            {selected.some((value) => !value) ? 'Ikkita xodimni tanlang' : 'Vazifalarni kim kiritishini belgilang'}
          </span>
        )}
        <Button onClick={handleSave} disabled={!isComplete || saveMutation.isPending}>
          {saveMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Saqlash
        </Button>
      </div>
    </div>
  )
}

export default KpiApproversPage
