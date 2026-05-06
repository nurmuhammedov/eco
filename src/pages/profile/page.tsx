import { useAuth } from '@/shared/hooks/use-auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { User, Phone, Building2, CreditCard, MapPin, Activity, RefreshCcw } from 'lucide-react'
import { useLegalApplicantInfo } from '@/features/application/application-detail/hooks/use-legal-applicant-info'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { Button } from '@/shared/components/ui/button'
import { useQueryClient } from '@tanstack/react-query'
import { QK_APPLICATIONS } from '@/shared/constants/query-keys'
import useUpdate from '@/shared/hooks/api/useUpdate'

export default function ProfilePage() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const { data, isLoading } = useLegalApplicantInfo(user?.tinOrPin)

  const { mutate, isPending } = useUpdate(
    '/users/legal',
    user?.tinOrPin,
    'put',
    'Ma’lumotlarni muvaffaqiyatli yangilandi!'
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
      <div className="h-full w-full p-6">
        <Skeleton className="h-full w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="flex h-full w-full flex-col p-2">
      <Card className="flex h-full flex-col overflow-hidden rounded-xl border-none bg-white shadow-sm ring-1 ring-gray-100">
        <CardHeader className="flex shrink-0 flex-row items-center justify-between border-b border-gray-100 bg-gray-50/50 px-6 py-3">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-800">Profil</CardTitle>
            <p className="text-sm text-gray-500">Tashkilot ma’lumotlari</p>
          </div>
          <Button size="sm" className="gap-2" onClick={handleUpdate} disabled={isPending}>
            <RefreshCcw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
            Ma’lumotlarni yangilash
          </Button>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <CreditCard size={24} />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-gray-500">Tashkilot STIR</p>
                <p className="text-lg font-semibold text-gray-900">
                  {data?.identity || user?.tinOrPin || 'Mavjud emas'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <Building2 size={24} />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-gray-500">Tashkilot nomi</p>
                <p className="text-lg font-semibold text-gray-900">{data?.name || 'Mavjud emas'}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <User size={24} />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-gray-500">Tashkilot rahbari F.I.SH.</p>
                <p className="text-lg font-semibold text-gray-900">
                  {data?.directorName || user?.name || 'Mavjud emas'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <MapPin size={24} />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-gray-500">Tashkilot manzili</p>
                <p className="text-lg font-semibold text-gray-900">{data?.address || 'Mavjud emas'}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <Phone size={24} />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-gray-500">Telefon raqami</p>
                <p className="text-lg font-semibold text-gray-900">{data?.phoneNumber || 'Mavjud emas'}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <Activity size={24} />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-gray-500">Tashkilotning faoliyat yuritish holati</p>
                <p className="text-lg font-semibold">
                  {data?.isActive === true ? (
                    <span className="text-green-600">Faol</span>
                  ) : data?.isActive === false ? (
                    <span className="text-red-600">Faol emas</span>
                  ) : (
                    <span className="text-gray-400">Mavjud emas</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
