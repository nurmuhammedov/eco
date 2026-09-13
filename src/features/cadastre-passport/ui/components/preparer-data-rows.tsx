import { format } from 'date-fns'
import DetailRow from '@/shared/components/common/detail-row'
import { EmptyValue } from '@/shared/components/common/empty-value'
import { CadastreSection } from '../../model/types'
import { StatusBadge } from './status-badge'

const unit = (value: string | number | null | undefined, suffix: string) =>
  value === null || value === undefined || value === '' ? '-' : `${value} ${suffix}`

const day = (value: string | null | undefined) => (value ? format(new Date(value), 'dd.MM.yyyy') : '-')

export const PreparerDataRows = ({ data }: { data: CadastreSection | null | undefined }) => {
  if (!data) return <p className="text-muted-foreground py-4 text-center text-sm">Ma’lumotlar mavjud emas</p>

  return (
    <>
      <DetailRow title="Obyektning nomi" value={data.name || '-'} />
      <DetailRow title="Obyektning idoraviy mansubligi" value={data.organizationalBelonging || '-'} />
      <DetailRow title="Manzil" value={data.address || '-'} />
      <DetailRow title="X koordinatasi" value={data.longitude ?? '-'} />
      <DetailRow title="Y koordinatasi" value={data.latitude ?? '-'} />
      <DetailRow title="Yer uchastkasi kadastr raqami" value={data.landCadastreNumber || '-'} />
      <DetailRow title="Kadastr ro‘yxatidan o‘tkazilgan guvohnoma sanasi" value={day(data.cadastreRegistrationDate)} />
      <DetailRow
        title="Kadastr ro‘yxatidan o‘tkazilgan guvohnoma raqami"
        value={data.cadastreRegistrationNumber || '-'}
      />
      <DetailRow title="Yer uchastkasi maydoni" value={unit(data.landArea, 'ga')} />
      <DetailRow title="Obyektning vazifasi" value={data.purpose || '-'} />
      <DetailRow title="Foydalanish moddasining nomi" value={data.substance || '-'} />
      <DetailRow
        title="Hozirgi kundagi holati"
        value={data.status ? <StatusBadge status={data.status} /> : <EmptyValue />}
      />
      <DetailRow title="Ekspluatatsiya qilingan sanasi" value={day(data.exploitationDate)} />
      <DetailRow title="Sanitariya muhofaza zonasi" value={data.protectionDistance || '-'} />
      <DetailRow title="Xodimlarning soni" value={unit(data.employeeCount, 'ta')} />
      <DetailRow title="Bir sutkada ishlash vaqti" value={unit(data.workingHour, 'soat')} />
      <DetailRow title="Aholi yashash punktigacha bo‘lgan masofa" value={unit(data.distanceToResidence, 'km')} />
      <DetailRow title="Eng yaqin boshqa obyektgacha bo‘lgan masofa" value={unit(data.distanceToNearestObject, 'm')} />
      <DetailRow title="Yong‘in-qutqaruv qismigacha bo‘lgan masofa" value={unit(data.distanceToFireDepartment, 'km')} />
      <DetailRow title="Yong‘in o‘chirish vositasining turi" value={data.firefightingEquipment || '-'} />
      <DetailRow title="Texnogen xavf sodir bo‘lganda zararlanish maydoni" value={unit(data.damageArea, 'm²')} />
      <DetailRow title="Ustunlik qiluvchi texnogen xavf turi" value={data.dominantHazardType || '-'} />
      <DetailRow title="Sug‘urtalangan miqdori bahosi" value={unit(data.estimatedValue, 'mln so‘m')} />
      <DetailRow
        title="Inson salomatligi uchun salbiy ta’sir ko‘rsatuvchi omillari"
        value={data.healthRiskFactor || '-'}
      />
    </>
  )
}
