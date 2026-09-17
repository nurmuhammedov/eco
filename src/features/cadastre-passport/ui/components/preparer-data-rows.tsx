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
 * The rows follow "ТХЮЗ маълумоти" in its own order and wording, so the page
 * can be read straight against the sheet it was filled in from. They are listed
 * even when the section is empty: a page that simply drops them leaves the
 * reader guessing whether the data is missing or the form never had the field.
 */
export const PreparerDataRows = ({ data }: { data: CadastreSection | null | undefined }) => {
  const values = data ?? {}

  return (
    <>
      <DetailRow title="Obyektning nomi" value={text(values.name)} />
      <DetailRow title="Obyektning idoraviy mansubligi" value={text(values.organizationalBelonging)} />
      <DetailRow title="Obyektning joylashgan manzili" value={text(values.address)} />
      <DetailRow title="Obyektning X koordinatasi" value={text(values.longitude)} />
      <DetailRow title="Obyektning Y koordinatasi" value={text(values.latitude)} />
      <DetailRow
        title="Obyektning yer uchastkasini kadastr ro‘yxatidan o‘tkazilgan guvohnoma raqami"
        value={text(values.cadastreRegistrationNumber)}
      />
      <DetailRow
        title="Obyektning yer uchastkasini kadastr ro‘yxatidan o‘tkazilgan guvohnoma sanasi"
        value={day(values.cadastreRegistrationDate)}
      />
      <DetailRow title="Obyektning yer uchastkasi kadastr raqami" value={text(values.landCadastreNumber)} />
      <DetailRow title="Obyektning yer uchastkasi maydoni (gektar)" value={unit(values.landArea, 'ga')} />
      <DetailRow title="Obyektning ekspluatatsiya qilingan sanasi" value={day(values.exploitationDate)} />
      <DetailRow title="Obyektning vazifasi" value={text(values.purpose)} />
      <DetailRow
        title="Obyektda ishlab chiqarish, qayta ishlash, saqlash va foydalanish moddasining nomi"
        value={text(values.substance)}
      />
      <DetailRow title="Obyektda xodimlarning soni (ta)" value={unit(values.employeeCount, 'ta')} />
      <DetailRow
        title="Obyektda bir sutka davomida xodimlarning ishlash vaqti (soat)"
        value={unit(values.workingHour, 'soat')}
      />
      <DetailRow title="Obyektda yong‘in o‘chirish vositasining turi" value={text(values.firefightingEquipment)} />
      <DetailRow
        title="Obyektdan yong‘in-qutqaruv qismigacha bo‘lgan masofa (km)"
        value={unit(values.distanceToFireDepartment, 'km')}
      />
      <DetailRow
        title="Obyektda texnogen xavf rivojlanishida ustunlik qiluvchi turi"
        value={text(values.dominantHazardType)}
      />
      <DetailRow
        title="Obyektda texnogen xavf sodir bo‘lganda zararlanish maydoni (m²)"
        value={unit(values.damageArea, 'm²')}
      />
      <DetailRow
        title="Obyektda texnogen xavf sodir bo‘lganda inson salomatligi uchun salbiy ta’sir ko‘rsatuvchi omillari"
        value={text(values.healthRiskFactor)}
      />
      <DetailRow
        title="Obyektdan eng yaqin bo‘lgan boshqa obyektgacha bo‘lgan masofa (metr)"
        value={unit(values.distanceToNearestObject, 'm')}
      />
      <DetailRow title="Obyektning sanitariya muhofaza zonasi (metr)" value={text(values.protectionDistance)} />
      <DetailRow
        title="Obyektdan aholi yashash punktigacha bo‘lgan masofa (km)"
        value={unit(values.distanceToResidence, 'km')}
      />
      <DetailRow
        title="Obyektning sug‘urtalangan miqdori bahosi (mln so‘m)"
        value={unit(values.estimatedValue, 'mln so‘m')}
      />
      <DetailRow
        title="Obyektning hozirgi kundagi holati"
        value={values.status ? <StatusBadge status={values.status} /> : <EmptyValue />}
      />
    </>
  )
}
