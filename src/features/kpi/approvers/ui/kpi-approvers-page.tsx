import { useEffect, useState } from 'react'
import { Loader2, ShieldCheck } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Label } from '@/shared/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { useKpiApproverCandidates, useKpiApprovers, useSaveKpiApprovers } from '../model/use-kpi-approvers'

const SLOTS = [0, 1] as const

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

  const pick = (slot: number, userId: string) => {
    setSelected((current) => current.map((value, index) => (index === slot ? userId : value)))

    // The one who was carrying the duty has just been replaced.
    if (assignerId && assignerId === selected[slot]) setAssignerId(userId)
  }

  const isComplete = selected.every(Boolean) && selected[0] !== selected[1] && selected.includes(assignerId)

  const handleSave = () => {
    saveMutation.mutate({
      approvers: selected.map((userId) => ({ user_id: userId, can_assign: userId === assignerId })),
    })
  }

  if (isLoading || isLoadingCandidates) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-56 w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="text-teal h-5 w-5" />
            KPI tasdiqlovchilari
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            KPI natijalarini ikki kishi tasdiqlaydi. Ikkalasi ham mas’ul bo‘lim boshlig‘i bo‘lishi kerak; ulardan biri
            KPI vazifalarini ham kiritadi. Tasdiqlovchilar o‘z natijalarini kirita olmaydi.
          </p>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          <RadioGroup value={assignerId} onValueChange={setAssignerId} className="flex flex-col gap-4">
            {SLOTS.map((slot) => {
              const otherId = selected[slot === 0 ? 1 : 0]
              const options = candidates.filter((user) => user.id !== otherId)

              return (
                <div key={slot} className="flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-4">
                  <div className="flex-1">
                    <Label className="mb-2 block">{slot + 1}-tasdiqlovchi</Label>
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
                  </div>

                  <div className="flex items-center gap-2 pb-2">
                    <RadioGroupItem value={selected[slot]} id={`assigner-${slot}`} disabled={!selected[slot]} />
                    <Label htmlFor={`assigner-${slot}`} className="cursor-pointer text-sm font-normal">
                      Vazifalarni ham shu kiritadi
                    </Label>
                  </div>
                </div>
              )
            })}
          </RadioGroup>

          <div className="flex items-center justify-end gap-3">
            {!isComplete && (
              <span className="text-muted-foreground text-sm">
                Ikkita turli xodim tanlang va biriga vazifa kiritishni belgilang
              </span>
            )}
            <Button onClick={handleSave} disabled={!isComplete || saveMutation.isPending}>
              {saveMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Saqlash
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default KpiApproversPage
