import { Activity, Building2, CreditCard, MapPin, Phone, RefreshCcw, User } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/shared/hooks/use-auth'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { QK_APPLICATIONS } from '@/shared/constants/query-keys'
import useUpdate from '@/shared/hooks/api/useUpdate'
import { useLegalApplicantInfo } from '@/features/application/application-detail/hooks/use-legal-applicant-info'
import { EmptyValue } from '@/shared/components/common/empty-value'

interface InfoItemProps {
  icon: React.ElementType
  label: string
  children: React.ReactNode
}

const InfoItem = ({ icon: Icon, label, children }: InfoItemProps) => (
  <div className="flex items-start gap-2.5">
    <span className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-lg">
      <Icon className="size-4" />
    </span>
    <div className="min-w-0 flex-1">
      <p className="text-muted-foreground text-xs">{label}</p>
      <div className="text-sm font-medium break-words">{children}</div>
    </div>
  </div>
)

export default function ProfilePage() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const { data, isLoading } = useLegalApplicantInfo(user?.tinOrPin)

  const { mutate, isPending } = useUpdate(
    '/users/legal',
    user?.tinOrPin,
    'put',
    'Ma’lumotlar muvaffaqiyatli yangilandi!'
  )

  const handleUpdate = () => {
    mutate(
      {},
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [QK_APPLICATIONS, 'APPLICANT_INFO', user?.tinOrPin] })
        },
      }
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-72 w-full rounded-xl" />
      </div>
    )
  }

  const organizationName = data?.name || user?.name

  return (
    <div className="flex flex-col gap-3">
      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <span className="bg-primary/10 text-primary flex size-12 shrink-0 items-center justify-center rounded-xl">
            <Building2 className="size-6" />
          </span>

          <div className="min-w-0 flex-1">
            <h2 className="truncate text-lg font-semibold">{organizationName || 'Tashkilot nomi aniqlanmadi'}</h2>
            <p className="text-muted-foreground mt-0.5 text-sm">STIR: {data?.identity || user?.tinOrPin || '—'}</p>
          </div>

          <div className="flex items-center gap-3">
            {data?.isActive !== undefined && (
              <Badge variant={data.isActive ? 'success' : 'error'}>{data.isActive ? 'Faol' : 'Faol emas'}</Badge>
            )}

            <Button variant="outline" size="sm" className="gap-2" onClick={handleUpdate} disabled={isPending}>
              <RefreshCcw className={`size-4 ${isPending ? 'animate-spin' : ''}`} />
              Yangilash
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="grid gap-x-8 gap-y-4 p-4 md:grid-cols-2">
          <InfoItem icon={CreditCard} label="Tashkilot STIR">
            {data?.identity || user?.tinOrPin || <EmptyValue />}
          </InfoItem>

          <InfoItem icon={Building2} label="Tashkilot nomi">
            {organizationName || <EmptyValue />}
          </InfoItem>

          <InfoItem icon={User} label="Tashkilot rahbari F.I.Sh.">
            {data?.directorName || <EmptyValue />}
          </InfoItem>

          <InfoItem icon={Phone} label="Telefon raqami">
            {data?.phoneNumber || <EmptyValue />}
          </InfoItem>

          <InfoItem icon={MapPin} label="Tashkilot manzili">
            {data?.address || <EmptyValue />}
          </InfoItem>

          <InfoItem icon={Activity} label="Faoliyat yuritish holati">
            {data?.isActive === undefined ? (
              <EmptyValue />
            ) : (
              <Badge variant={data.isActive ? 'success' : 'error'}>{data.isActive ? 'Faol' : 'Faol emas'}</Badge>
            )}
          </InfoItem>
        </CardContent>
      </Card>
    </div>
  )
}
