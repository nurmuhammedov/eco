import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Input } from '@/shared/components/ui/input'
import { NoData } from '@/shared/components/common/no-data'
import { useServicesPaginatedData } from '@/shared/hooks/api'
import { useDebounce } from '@/shared/hooks/use-debounce'
import { SERVICES_API_ENDPOINTS } from '@/shared/api/endpoints'
import { cn } from '@/shared/lib/utils'
import { DIRECTION, EMPLOYEE_TYPE } from '@/entities/attestation/model/labels'
import type { AttestationApplication, AttestationCalendar } from '@/entities/attestation/model/types'
import { useAttachApplications } from '@/features/attestation/exams/model/use-exams'

/** More than one exam day can hold, so the whole matching queue fits in one page */
const QUEUE_PAGE_SIZE = 100

interface Props {
  calendar: AttestationCalendar
  isOpen: boolean
  onClose: () => void
}

/** Adds more queued applications of the exam's employee type before it starts. */
export const AddApplicationsDialog = ({ calendar, isOpen, onClose }: Props) => {
  const [search, setSearch] = useState('')
  const [picked, setPicked] = useState<Set<string>>(new Set())
  const attach = useAttachApplications()
  const debouncedSearch = useDebounce(search.trim(), 400)

  const { data, isLoading } = useServicesPaginatedData<AttestationApplication>(
    SERVICES_API_ENDPOINTS.APPLICATIONS,
    {
      status: 'NEW',
      employee_type: calendar.employee_type,
      search: debouncedSearch || undefined,
      size: QUEUE_PAGE_SIZE,
    },
    isOpen
  )

  const applications = data?.content ?? []

  useEffect(() => {
    if (!isOpen) {
      setSearch('')
      setPicked(new Set())
    }
  }, [isOpen])

  const toggle = (id: string, checked: boolean) =>
    setPicked((current) => {
      const next = new Set(current)
      if (checked) next.add(id)
      else next.delete(id)

      return next
    })

  const handleSubmit = () => attach.mutate({ id: calendar.id, applicationIds: [...picked] }, { onSuccess: onClose })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent size="xl">
        <DialogHeader>
          <DialogTitle>Imtihonga ariza qo‘shish</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted-foreground">Navbatdagi</span>
            <Badge variant="outline" className={EMPLOYEE_TYPE[calendar.employee_type].className}>
              {EMPLOYEE_TYPE[calendar.employee_type].label}
            </Badge>
            <span className="text-muted-foreground">arizalari</span>
            {picked.size > 0 && <span className="ml-auto font-medium">Tanlandi: {picked.size}</span>}
          </div>

          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Xodim yoki tashkilot nomi bo‘yicha qidirish"
          />

          {isLoading && (
            <div className="flex justify-center py-10">
              <Loader2 className="text-primary h-6 w-6 animate-spin" />
            </div>
          )}

          {!isLoading && applications.length === 0 && <NoData text="Navbatda mos ariza yo‘q" />}

          {!isLoading && applications.length > 0 && (
            <div className="max-h-[360px] space-y-2 overflow-y-auto pr-1">
              {applications.map((application) => {
                const isChecked = picked.has(application.id)
                const checkboxId = `queued-${application.id}`

                return (
                  <div
                    key={application.id}
                    className={cn(
                      'flex items-start gap-3 rounded-lg border p-3 transition-colors',
                      isChecked && 'border-primary/40 bg-primary/5'
                    )}
                  >
                    <Checkbox
                      id={checkboxId}
                      checked={isChecked}
                      onCheckedChange={(value) => toggle(application.id, value === true)}
                      className="mt-1"
                    />
                    <label htmlFor={checkboxId} className="min-w-0 flex-1 cursor-pointer">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">{application.employee_name}</span>
                        <span className="text-muted-foreground text-xs">{application.employee_pin}</span>
                      </span>
                      <span className="text-muted-foreground mt-0.5 block text-xs">
                        {application.organization_name} · {DIRECTION[application.direction] ?? application.direction}
                      </span>
                    </label>
                  </div>
                )
              })}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={attach.isPending}>
              Bekor qilish
            </Button>
            <Button onClick={handleSubmit} disabled={attach.isPending || picked.size === 0}>
              {attach.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Qo‘shish
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
