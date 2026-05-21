import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { usePublicEquipmentDetail } from '../hooks/usePublicEquipmentDetail'
import { getDate } from '@/shared/utils/date.ts'
import YandexMap from '@/shared/components/common/yandex-map/ui/yandex-map.tsx'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/lib/utils'
import { Badge } from '@/shared/components/ui/badge'
import { Coordinate } from '@/shared/components/common/yandex-map'
import FileLink from '@/shared/components/common/file-link'

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  ACTIVE: { label: 'Reyestrdagi qurilma', className: 'bg-green-100 text-green-700 hover:bg-green-200' },
  VALID: { label: 'Reyestrdagi qurilma', className: 'bg-green-100 text-green-700 hover:bg-green-200' },
  INACTIVE: { label: 'Reyestrdan chiqarilgan', className: 'bg-red-100 text-red-700 hover:bg-red-200' },
  EXPIRED: { label: 'Muddati o‘tgan', className: 'bg-red-100 text-red-700 hover:bg-red-200' },
  NO_DATE: { label: 'Muddati kiritilmagan', className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' },
  DEFAULT: { label: 'Noma’lum holat', className: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
}

const DetailRow = ({ label, value, className }: { label: string; value: React.ReactNode; className?: string }) => {
  if (value === null || value === undefined || value === '' || value === '-') return null
  return (
    <div
      className={cn(
        'flex flex-col items-start justify-between gap-1 border-b py-3 last:border-0 sm:flex-row sm:items-center',
        className
      )}
    >
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="text-right text-sm font-medium">{value}</span>
    </div>
  )
}

const SectionHeader = ({ title }: { title: string }) => (
  <div className="border-b bg-blue-50/50 p-4">
    <h2 className="text-lg font-semibold text-blue-600">{title}</h2>
  </div>
)

export const ContactForm = () => {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const { data, isLoading } = usePublicEquipmentDetail(id)

  const mapCoordinates = useMemo(() => {
    if (!data?.location) return []
    const coords = data.location.split(',')?.map(Number)
    return coords.length === 2 ? [coords] : []
  }, [data?.location])

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-muted-foreground mx-auto w-full max-w-4xl p-6 text-center">
        <p>Ushbu ID bo‘yicha qurilma maʼlumotlari topilmadi.</p>
      </div>
    )
  }

  const status = STATUS_MAP[data.status || ''] || STATUS_MAP.DEFAULT

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 pb-6">
      <div className="bg-card overflow-hidden rounded-lg border shadow-sm">
        <SectionHeader title="Qurilma maʼlumotlari" />
        <div className="p-4 sm:p-6">
          <DetailRow label="Qurilma" value={data.typeName} />
          <DetailRow label="Qurilma nomi" value={data.attractionName} />
          <DetailRow label="Qurilma turi" value={data.childEquipmentName} />
          <DetailRow label="Qurilma tipi" value={data.childEquipmentSortName} />
          <DetailRow label="Ro‘yxatga olingan raqam" value={data.registryNumber} />
          <DetailRow label="Inspektor" value={data.inspectorName} />
          <DetailRow label="Ro‘yxatga olingan sana" value={getDate(data.registrationDate)} />
          <DetailRow label="Ishlab chiqarilgan sana" value={getDate(data.manufacturedAt)} />
          <DetailRow label="Foydalanishga qabul qilingan" value={getDate(data.acceptedAt)} />
          <DetailRow label="Xizmat muddati" value={getDate(data.servicePeriod)} />
          <DetailRow label="Biomexanik xavf darajasi" value={data.riskLevel} />

          {/* Parameters */}
          {data.parameters && (
            <>
              <DetailRow label="Strelasining uzunligi" value={data.parameters.boomLength} />
              <DetailRow label="Yuk ko‘tara olish quvvati" value={data.parameters.liftingCapacity} />
              <DetailRow label="Hajmi" value={data.parameters.capacity} />
              <DetailRow label="Ruxsat etilgan bosim" value={data.parameters.pressure} />
              <DetailRow label="Diametr" value={data.parameters.diameter} />
              <DetailRow label="Uzunligi" value={data.parameters.length} />
              <DetailRow label="Tezligi" value={data.parameters.speed} />
              <DetailRow label="Balandligi" value={data.parameters.height} />
              <DetailRow label="To‘xtashlar soni" value={data.parameters.stopCount} />
            </>
          )}

          <DetailRow
            label="Holati"
            value={<Badge className={cn('pointer-events-none', status.className)}>{status.label}</Badge>}
          />

          <DetailRow label="Tashkilot nomi" value={data.ownerName} />
          <DetailRow label="Tashkilot STIR" value={data.ownerIdentity} />
          <DetailRow
            label="Reyestrga qo‘yilganligi to‘g‘risidagi hujjat"
            value={data.registryFilePath ? <FileLink url={data.registryFilePath} title="Yuklab olish" /> : null}
          />
          <DetailRow
            label="Reyestrdan chiqarilganligi to‘g‘risidagi hujjat"
            value={data.deregisterFilePath ? <FileLink url={data.deregisterFilePath} title="Yuklab olish" /> : null}
          />

          {Object.entries(data.files).map(([key, file]: [string, any]) => {
            if (!file || !file.expiryDate) return null
            const equipmentType = data.type || 'CRANE'
            const label = t(`labels.${equipmentType}.${key}`)
            return (
              <div key={key} className="flex flex-col border-b py-2 last:border-0 sm:flex-row sm:justify-between">
                <span className="text-muted-foreground text-sm">{label}</span>
                <span className="text-right text-sm font-medium">{getDate(file.expiryDate)}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="bg-card overflow-hidden rounded-lg border shadow-sm">
        <div className="flex flex-col items-center justify-center p-6 text-center md:p-10">
          <h3 className="mb-3 text-xl font-semibold">Murojaat yuborish</h3>
          <p className="text-muted-foreground mb-6 max-w-lg">
            Ushbu qurilma bo‘yicha qandaydir muammo yoki taklifingiz bo‘lsa, bizning ochiq murojaat tizimimiz orqali
            murojaat yuborishingiz mumkin.
          </p>
          <Link to={`/public-inquiry-choice?belongId=${data.id}&belongType=EQUIPMENT`}>
            <Button size="lg" className="w-full sm:w-auto">
              Murojaat yuborish sahifasiga o‘tish
            </Button>
          </Link>
        </div>
      </div>

      {mapCoordinates.length > 0 && (
        <div className="bg-card overflow-hidden rounded-lg border shadow-sm">
          <SectionHeader title="Qurilma manzili" />
          <YandexMap
            coords={mapCoordinates as unknown as Coordinate[]}
            center={mapCoordinates[0] as unknown as Coordinate}
            zoom={16}
          />
        </div>
      )}
    </div>
  )
}
