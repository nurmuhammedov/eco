import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, Info, Loader2, Search } from 'lucide-react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { NoData } from '@/shared/components/common/no-data'
import { cn } from '@/shared/lib/utils'
import { DIRECTION, EMPLOYEE_TYPE } from '@/entities/attestation/model/labels'
import type { AttestationEmployee, Direction, EmployeeType } from '@/entities/attestation/model/types'
import { useOrganizationEmployees, useSubmitRequest } from '../model/use-requests'

interface Props {
  isOpen: boolean
  onClose: () => void
}

interface Group {
  direction: Direction
  employeeType: EmployeeType
}

/** The same person may hold certificates in two directions, so a row is a person and a certificate group */
const rowKey = (employee: AttestationEmployee) =>
  `${employee.pinfl}|${employee.direction ?? ''}|${employee.employee_type ?? ''}`

const groupOf = (employee: AttestationEmployee): Group | null =>
  employee.direction && employee.employee_type
    ? { direction: employee.direction, employeeType: employee.employee_type }
    : null

/**
 * An organization's request. The employee type and the direction come from
 * each training certificate number, and one request holds employees of a
 * single direction and type, so the first pick decides the rest.
 */
export function SubmitRequestModal({ isOpen, onClose }: Props) {
  const [selection, setSelection] = useState<Map<string, { employee: AttestationEmployee; position: string }>>(
    new Map()
  )
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')

  const { data: employees = [], isLoading } = useOrganizationEmployees(isOpen)
  const submitMutation = useSubmitRequest()

  useEffect(() => {
    if (!isOpen) {
      setSelection(new Map())
      setSearch('')
      setError('')
    }
  }, [isOpen])

  const picked = [...selection.values()]
  const group = picked.length ? groupOf(picked[0].employee) : null

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase()

    return query
      ? employees.filter(
          (employee) => employee.full_name.toLowerCase().includes(query) || employee.pinfl.includes(query)
        )
      : employees
  }, [employees, search])

  const blockReason = (employee: AttestationEmployee): string | null => {
    const own = groupOf(employee)

    if (!own) return 'Sertifikat raqamidan yo‘nalish va xodim turi aniqlanmadi'
    if (employee.has_active_application) return 'Bu yo‘nalishda tugallanmagan arizasi bor'
    if (group && (group.direction !== own.direction || group.employeeType !== own.employeeType)) {
      return 'Boshqa yo‘nalish yoki turdagi xodim — alohida ariza bering'
    }

    return null
  }

  const toggle = (employee: AttestationEmployee, checked: boolean) =>
    setSelection((current) => {
      const next = new Map(current)

      if (checked) next.set(rowKey(employee), { employee, position: '' })
      else next.delete(rowKey(employee))

      return next
    })

  const setPosition = (key: string, position: string) =>
    setSelection((current) => {
      const next = new Map(current)
      const item = next.get(key)

      if (item) next.set(key, { ...item, position })

      return next
    })

  const handleSubmit = () => {
    if (!group || picked.length === 0) {
      setError('Kamida bitta xodim tanlanishi shart.')
      return
    }

    if (picked.some((item) => !item.position.trim())) {
      setError('Har bir tanlangan xodimning lavozimi kiritilishi shart.')
      return
    }

    setError('')

    submitMutation.mutate(
      {
        direction: group.direction,
        employee_type: group.employeeType,
        employees: picked.map((item) => ({
          employee_pin: item.employee.pinfl,
          employee_position: item.position.trim(),
        })),
      },
      { onSuccess: onClose }
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent size="xl">
        <DialogHeader>
          <DialogTitle>Attestatsiyaga ariza berish</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted/50 flex items-start gap-2.5 rounded-md p-3 text-sm">
            <Info className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
            <div className="text-muted-foreground space-y-1">
              <p>
                Xodim turi va yo‘nalish o‘quv markazi sertifikati raqamidan olinadi. Bitta arizada faqat bir xil
                yo‘nalish va turdagi xodimlar bo‘ladi.
              </p>
              <p>
                Arizani komissiya uch ish kunida ko‘rib chiqadi. Imtihon kuni va joyini komissiya belgilaydi va
                tashkilotga xat bilan ma’lum qiladi.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="relative w-full max-w-xs">
              <Search className="text-muted-foreground absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="F.I.Sh. yoki JSHSHIR"
                className="pl-8"
              />
            </div>

            {group && (
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="text-muted-foreground">Tanlandi: {picked.length}</span>
                <Badge variant="outline">{DIRECTION[group.direction]}</Badge>
                <Badge variant="outline" className={EMPLOYEE_TYPE[group.employeeType].className}>
                  {EMPLOYEE_TYPE[group.employeeType].label}
                </Badge>
              </div>
            )}
          </div>

          {isLoading && (
            <div className="flex justify-center py-10">
              <Loader2 className="text-primary h-6 w-6 animate-spin" />
            </div>
          )}

          {!isLoading && employees.length === 0 && (
            <NoData text="Tashkilotingiz bo‘yicha o‘quv markazidan xodim topilmadi" />
          )}

          {!isLoading && employees.length > 0 && (
            <div className="max-h-[360px] space-y-2 overflow-y-auto pr-1">
              {visible.map((employee) => {
                const key = rowKey(employee)
                const chosen = selection.get(key)
                const reason = chosen ? null : blockReason(employee)

                return (
                  <div
                    key={key}
                    className={cn(
                      'rounded-lg border p-3 transition-colors',
                      chosen && 'border-primary/40 bg-primary/5',
                      reason && 'opacity-60'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={!!chosen}
                        disabled={!!reason}
                        onCheckedChange={(value) => toggle(employee, value === true)}
                        className="mt-1"
                        aria-label={`${employee.full_name}ni tanlash`}
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium">{employee.full_name}</span>
                          <span className="text-muted-foreground text-xs">{employee.pinfl}</span>
                          {employee.direction && <Badge variant="outline">{DIRECTION[employee.direction]}</Badge>}
                          {employee.employee_type && (
                            <Badge variant="outline" className={EMPLOYEE_TYPE[employee.employee_type].className}>
                              {EMPLOYEE_TYPE[employee.employee_type].label}
                            </Badge>
                          )}
                          {employee.is_certificate_expired && (
                            <Badge variant="warning">Sertifikat muddati o‘tgan</Badge>
                          )}
                        </div>

                        <p className="text-muted-foreground mt-0.5 text-xs">
                          {employee.course_name || employee.science_direction || 'O‘quv kursi ko‘rsatilmagan'}
                          {employee.certificate_number ? ` · ${employee.certificate_number}` : ''}
                        </p>

                        {reason && <p className="mt-1 text-xs text-orange-700">{reason}</p>}

                        {chosen && (
                          <div className="mt-3 max-w-sm space-y-1">
                            <Label className="text-xs">
                              Lavozimi <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              value={chosen.position}
                              onChange={(event) => setPosition(key, event.target.value)}
                              placeholder="Masalan: Bosh muhandis"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}

              {visible.length === 0 && <NoData text="Qidiruv bo‘yicha xodim topilmadi" />}
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-2.5 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={submitMutation.isPending}>
            Bekor qilish
          </Button>
          <Button onClick={handleSubmit} disabled={submitMutation.isPending || picked.length === 0}>
            {submitMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Arizani yuborish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
