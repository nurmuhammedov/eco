import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { useOrgPositions, usePartnerOrgs } from '../api'

const ALL = '__all__'

interface BaseSelectProps {
  value?: string
  onChange: (value: string) => void
  className?: string
  placeholder?: string
  allLabel?: string
}

export const OrgSelect = ({
  value,
  onChange,
  className,
  placeholder = 'Tashkilotni tanlang',
  allLabel,
  onlyActive,
}: BaseSelectProps & { onlyActive?: boolean }) => {
  const { data, isLoading } = usePartnerOrgs()
  const orgs = (data ?? []).filter((org) => !onlyActive || org.isActive)

  return (
    <Select value={value || (allLabel ? ALL : '')} onValueChange={(next) => onChange(next === ALL ? '' : next)}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={isLoading ? 'Yuklanmoqda...' : placeholder} />
      </SelectTrigger>
      <SelectContent>
        {allLabel && <SelectItem value={ALL}>{allLabel}</SelectItem>}
        {!isLoading && !orgs.length && (
          <p className="text-muted-foreground px-2 py-1.5 text-sm">
            Tashkilot topilmadi. Avval «Tashkilotlar» bo‘limida qo‘shing
          </p>
        )}
        {orgs.map((org) => (
          <SelectItem key={org.id} value={org.id}>
            {`${org.code} — ${org.name}`}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export const PositionSelect = ({
  orgId,
  value,
  onChange,
  className,
  placeholder = 'Lavozimni tanlang',
  allLabel,
}: BaseSelectProps & { orgId?: string }) => {
  const { data, isLoading } = useOrgPositions(orgId || undefined)

  return (
    <Select
      value={value || (allLabel ? ALL : '')}
      onValueChange={(next) => onChange(next === ALL ? '' : next)}
      disabled={!orgId}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={orgId && isLoading ? 'Yuklanmoqda...' : placeholder} />
      </SelectTrigger>
      <SelectContent>
        {allLabel && <SelectItem value={ALL}>{allLabel}</SelectItem>}
        {!isLoading && !data?.length && (
          <p className="text-muted-foreground px-2 py-1.5 text-sm">
            Lavozim topilmadi. Avval «Lavozimlar» bo‘limida qo‘shing
          </p>
        )}
        {(data ?? []).map((position) => (
          <SelectItem key={position.id} value={position.id}>
            {position.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
