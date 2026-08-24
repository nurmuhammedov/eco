import { useEffect, useMemo, useState } from 'react'
import { format, parseISO } from 'date-fns'
import { AlertCircle, Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { NoData } from '@/shared/components/common/no-data'
import { cn } from '@/shared/lib/utils'
import { DIRECTION_OPTIONS, EMPLOYEE_TYPE } from '@/entities/attestation/model/labels'
import type { Direction } from '@/entities/attestation/model/types'
import { useAvailableDates, useCreateApplication, useOrganizationEmployees } from '../model/use-applications'

interface Props {
  isOpen: boolean
  onClose: () => void
}

interface SelectionState {
  position: string
  direction: Direction | ''
}

export function CreateApplicationModal({ isOpen, onClose }: Props) {
  const [calendarId, setCalendarId] = useState('')
  const [selection, setSelection] = useState<Record<string, SelectionState>>({})
  const [error, setError] = useState('')

  const { data: calendars = [], isLoading: isLoadingDates } = useAvailableDates(undefined, isOpen)
  const { data: employees = [], isLoading: isLoadingEmployees } = useOrganizationEmployees(isOpen)
  const createMutation = useCreateApplication()

  const calendar = useMemo(() => calendars.find((item) => item.id === calendarId), [calendars, calendarId])
  const selectedPins = Object.keys(selection)

  useEffect(() => {
    if (!isOpen) {
      setCalendarId('')
      setSelection({})
      setError('')
    }
  }, [isOpen])

  // Changing the session resets the picks: the employee type may no longer match
  useEffect(() => {
    setSelection({})
    setError('')
  }, [calendarId])

  const toggleEmployee = (pinfl: string, checked: boolean) => {
    setSelection((prev) => {
      const next = { ...prev }

      if (checked) {
        next[pinfl] = { position: '', direction: '' }
      } else {
        delete next[pinfl]
      }

      return next
    })
  }

  const patchEmployee = (pinfl: string, patch: Partial<SelectionState>) => {
    setSelection((prev) => ({ ...prev, [pinfl]: { ...prev[pinfl], ...patch } }))
  }

  const handleSubmit = () => {
    if (!calendar) {
      setError('Majburiy maydon!')
      return
    }

    if (selectedPins.length === 0) {
      setError('Kamida bitta xodim tanlanishi shart.')
      return
    }

    if (selectedPins.length > calendar.remaining_capacity) {
      setError(`Bu qabul vaqtida ${calendar.remaining_capacity} ta bo‘sh joy bor.`)
      return
    }

    const incomplete = selectedPins.some((pin) => !selection[pin].position.trim() || !selection[pin].direction)

    if (incomplete) {
      setError('Har bir xodim uchun lavozim va yo‘nalish to‘ldirilishi shart.')
      return
    }

    setError('')

    createMutation.mutate(
      {
        attestation_calendar_id: calendar.id,
        employees: selectedPins.map((pin) => {
          const employee = employees.find((item) => item.pinfl === pin)!

          return {
            employee_pin: pin,
            employee_name: employee.full_name,
            employee_position: selection[pin].position.trim(),
            employee_type: calendar.employee_type,
            direction: selection[pin].direction as Direction,
          }
        }),
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
          <div className="space-y-1.5">
            <Label>
              Qabul vaqti <span className="text-red-500">*</span>
            </Label>
            <Select value={calendarId} onValueChange={setCalendarId} disabled={isLoadingDates}>
              <SelectTrigger>
                <SelectValue placeholder={isLoadingDates ? 'Yuklanmoqda...' : 'Qabul vaqtini tanlang'} />
              </SelectTrigger>
              <SelectContent>
                {calendars.map((item) => (
                  <SelectItem key={item.id} value={item.id} disabled={item.remaining_capacity <= 0}>
                    {format(parseISO(item.start_date), 'dd.MM.yyyy')} · {format(parseISO(item.start_date), 'HH:mm')}–
                    {format(parseISO(item.end_date), 'HH:mm')} · {EMPLOYEE_TYPE[item.employee_type].label} ·{' '}
                    {item.remaining_capacity} ta joy
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {!isLoadingDates && calendars.length === 0 && (
              <p className="text-muted-foreground text-xs">Hozircha ochiq qabul vaqti yo‘q.</p>
            )}
          </div>

          {calendar && (
            <div className="bg-muted/50 flex flex-wrap items-center gap-3 rounded-md p-3 text-sm">
              <span className="text-muted-foreground">Ushbu vaqtga faqat</span>
              <Badge variant="outline" className={EMPLOYEE_TYPE[calendar.employee_type].className}>
                {EMPLOYEE_TYPE[calendar.employee_type].label}
              </Badge>
              <span className="text-muted-foreground">tanlanadi.</span>
              <span className="ml-auto font-medium">
                Tanlandi: {selectedPins.length} / {calendar.remaining_capacity}
              </span>
            </div>
          )}

          <div>
            <Label className="mb-2 block">Xodimlar</Label>

            {isLoadingEmployees && (
              <div className="flex justify-center py-10">
                <Loader2 className="text-primary h-6 w-6 animate-spin" />
              </div>
            )}

            {!isLoadingEmployees && employees.length === 0 && (
              <NoData text="Tashkilotingiz bo‘yicha o‘quv markazidan xodim topilmadi" />
            )}

            {!isLoadingEmployees && employees.length > 0 && (
              <div className="max-h-[320px] space-y-2 overflow-y-auto pr-1">
                {employees.map((employee) => {
                  const isChecked = !!selection[employee.pinfl]
                  const isBlocked = employee.has_active_application

                  return (
                    <div
                      key={employee.pinfl}
                      className={cn(
                        'rounded-lg border p-3 transition-colors',
                        isChecked && 'border-primary/40 bg-primary/5',
                        isBlocked && 'opacity-60'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={isChecked}
                          disabled={isBlocked || !calendar}
                          onCheckedChange={(value) => toggleEmployee(employee.pinfl, value === true)}
                          className="mt-1"
                        />

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-medium">{employee.full_name}</span>
                            <span className="text-muted-foreground text-xs">{employee.pinfl}</span>
                            {employee.is_certificate_expired && (
                              <Badge variant="warning">Sertifikat muddati o‘tgan</Badge>
                            )}
                            {isBlocked && <Badge variant="secondary">Tugallanmagan arizasi bor</Badge>}
                          </div>

                          <p className="text-muted-foreground mt-0.5 text-xs">
                            {employee.science_direction || 'Yo‘nalish ko‘rsatilmagan'}
                            {employee.certificate_number ? ` · ${employee.certificate_number}` : ''}
                          </p>

                          {isChecked && (
                            <div className="mt-3 grid gap-3 sm:grid-cols-2">
                              <div className="space-y-1">
                                <Label className="text-xs">
                                  Lavozimi <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  value={selection[employee.pinfl].position}
                                  onChange={(event) => patchEmployee(employee.pinfl, { position: event.target.value })}
                                  placeholder="Masalan: Bosh muhandis"
                                />
                              </div>

                              <div className="space-y-1">
                                <Label className="text-xs">
                                  Yo‘nalish <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                  value={selection[employee.pinfl].direction}
                                  onValueChange={(value) =>
                                    patchEmployee(employee.pinfl, { direction: value as Direction })
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Tanlang" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {DIRECTION_OPTIONS.map((option) => (
                                      <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-2.5 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={createMutation.isPending}>
              Bekor qilish
            </Button>
            <Button onClick={handleSubmit} disabled={createMutation.isPending || !calendar}>
              {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Arizani yuborish
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
