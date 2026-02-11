import { useParams } from 'react-router-dom'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Accident } from '../model/types'
import { DetailCardAccordion } from '@/shared/components/common/detail-card'
import DetailRow from '@/shared/components/common/detail-row'
import { Loader } from '@/shared/components/common'
import useDetail from '@/shared/hooks/api/useDetail'

export const AccidentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()

  const { detail: accident, isLoading } = useDetail<Accident>('/accidents', id, !!id)

  if (isLoading) return <Loader isVisible />

  if (!accident) {
    return (
      <Card className="mt-4">
        <CardContent>
          <p className="p-4 text-center">Maʼlumotlar topilmadi</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="mt-4">
      <DetailCardAccordion defaultValue={['accident_info', 'victims']}>
        <DetailCardAccordion.Item value="accident_info" title="Baxtsiz hodisa to‘g‘risida ma’lumot">
          <div className="flex flex-col py-1">
            <DetailRow title="Baxtsiz hodisa sodir bo‘lgan sana:" value={accident.date} />
            <DetailRow
              title="Baxtsiz hodisaga olib kelgan sharoitning qisqacha tafsiloti:"
              value={<div dangerouslySetInnerHTML={{ __html: accident.shortDetail || '-' }} />}
            />
            <DetailRow
              title="Hujjat qaysi huquqni muhofaza qiluvchi organlarga yuborilgan, xat sanasi va raqami:"
              value={<div dangerouslySetInnerHTML={{ __html: accident.lettersInfo || '-' }} />}
            />
            <DetailRow
              title="Baxtsiz hodisa asosiy sabablari tahlili va muammolar:"
              value={<div dangerouslySetInnerHTML={{ __html: accident.analyses || '-' }} />}
            />
            <DetailRow
              title="Sanoat xavfsizligi davlat qo‘mitasi hay’ati va korxona tomonidan ko‘rilgan profilaktik choralar:"
              value={<div dangerouslySetInnerHTML={{ __html: accident.preventions || '-' }} />}
            />
            <DetailRow
              title="Baxtsiz hodisaning oldini olish va shunday holatlar takrorlanmasligi uchun berilgan takliflar:"
              value={<div dangerouslySetInnerHTML={{ __html: accident.recommendations || '-' }} />}
            />
          </div>
        </DetailCardAccordion.Item>

        <DetailCardAccordion.Item value="victims" title="Jabrlanuvchilar">
          <div className="flex flex-col gap-4 py-1">
            {accident.victims && accident.victims.length > 0 ? (
              accident.victims.map((victim, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <h4 className="mb-2 font-semibold">{index + 1}-jabrlanuvchi</h4>
                    <DetailRow title="F.I.Sh:" value={victim.fullName} />
                    <DetailRow title="Tug'ilgan yili:" value={victim.birthYear} />
                    <DetailRow title="Lavozimi:" value={victim.position} />
                    <DetailRow title="Ish staji:" value={victim.experience} />
                    <DetailRow title="Oilaviy holati:" value={victim.maritalStatus} />
                    <DetailRow title="Jarohat darajasi:" value={victim.injuryStatus} />
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="p-2">Jabrlanuvchilar yo'q</p>
            )}
          </div>
        </DetailCardAccordion.Item>
      </DetailCardAccordion>
    </div>
  )
}
