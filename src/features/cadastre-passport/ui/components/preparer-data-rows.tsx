import { format } from 'date-fns'
import DetailRow from '@/shared/components/common/detail-row'
import { EmptyValue } from '@/shared/components/common/empty-value'
import { CadastreSection } from '../../model/types'
import { StatusBadge } from './status-badge'

const isBlank = (value: unknown) => value === null || value === undefined || value === ''

const text = (value: string | number | null | undefined) => (isBlank(value) ? <EmptyValue /> : String(value))

const unit = (value: string | number | null | undefined, suffix: string) =>
  isBlank(value) ? <EmptyValue /> : `${value} ${suffix}`

const day = (value: string | null | undefined) => (value ? format(new Date(value), 'dd.MM.yyyy') : <EmptyValue />)

/**
 * The rows are listed even when the section is empty: a page that simply drops
 * them leaves the reader guessing whether the data is missing or the form never
 * had the field.
 */
export const PreparerDataRows = ({ data }: { data: CadastreSection | null | undefined }) => {
  const values = data ?? {}

  return (
    <>
      <DetailRow title="Obyektning nomi" value={text(values.name)} />
      <DetailRow title="Obyektning idoraviy mansubligi" value={text(values.organizationalBelonging)} />
      <DetailRow title="Manzil" value={text(values.address)} />
      <DetailRow title="X koordinatasi" value={text(values.longitude)} />
      <DetailRow title="Y koordinatasi" value={text(values.latitude)} />
      <DetailRow title="Yer uchastkasi kadastr raqami" value={text(values.landCadastreNumber)} />
      <DetailRow
        title="Kadastr ro‘yxatidan o‘tkazilgan guvohnoma sanasi"
        value={day(values.cadastreRegistrationDate)}
      />
      <DetailRow
        title="Kadastr ro‘yxatidan o‘tkazilgan guvohnoma raqami"
        value={text(values.cadastreRegistrationNumber)}
      />
      <DetailRow title="Yer uchastkasi maydoni" value={unit(values.landArea, 'ga')} />
      <DetailRow title="Obyektning vazifasi" value={text(values.purpose)} />
      <DetailRow title="Foydalanish moddasining nomi" value={text(values.substance)} />
      <DetailRow
        title="Hozirgi kundagi holati"
        value={values.status ? <StatusBadge status={values.status} /> : <EmptyValue />}
      />
      <DetailRow title="Ekspluatatsiya qilingan sanasi" value={day(values.exploitationDate)} />
      <DetailRow title="Sanitariya muhofaza zonasi" value={text(values.protectionDistance)} />
      <DetailRow title="Xodimlarning soni" value={unit(values.employeeCount, 'ta')} />
      <DetailRow title="Bir sutkada ishlash vaqti" value={unit(values.workingHour, 'soat')} />
      <DetailRow title="Aholi yashash punktigacha bo‘lgan masofa" value={unit(values.distanceToResidence, 'km')} />
      <DetailRow
        title="Eng yaqin boshqa obyektgacha bo‘lgan masofa"
        value={unit(values.distanceToNearestObject, 'm')}
      />
      <DetailRow
        title="Yong‘in-qutqaruv qismigacha bo‘lgan masofa"
        value={unit(values.distanceToFireDepartment, 'km')}
      />
      <DetailRow title="Yong‘in o‘chirish vositasining turi" value={text(values.firefightingEquipment)} />
      <DetailRow title="Texnogen xavf sodir bo‘lganda zararlanish maydoni" value={unit(values.damageArea, 'm²')} />
      <DetailRow title="Ustunlik qiluvchi texnogen xavf turi" value={text(values.dominantHazardType)} />
      <DetailRow title="Sug‘urtalangan miqdori bahosi" value={unit(values.estimatedValue, 'mln so‘m')} />
      <DetailRow
        title="Inson salomatligi uchun salbiy ta’sir ko‘rsatuvchi omillari"
        value={text(values.healthRiskFactor)}
      />
    </>
  )
}
