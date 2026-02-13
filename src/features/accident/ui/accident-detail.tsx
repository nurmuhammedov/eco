import { useParams } from 'react-router-dom'
import { Card, CardContent } from '@/shared/components/ui/card'
import DetailRow from '@/shared/components/common/detail-row'
import { GoBack } from '@/shared/components/common'
import { DetailCardAccordion } from '@/shared/components/common/detail-card'
import useDetail from '@/shared/hooks/api/useDetail'
import useData from '@/shared/hooks/api/useData'
import LegalApplicantInfo from '@/features/application/application-detail/ui/parts/legal-applicant-info'
import AppealMainInfo from '@/features/application/application-detail/ui/parts/appeal-main-info'
import FilesSection from '@/features/application/application-detail/ui/parts/files-section'
import { Accident, InjuryStatus } from '../model/types'
import { format } from 'date-fns'
import { Badge } from '@/shared/components/ui/badge'

export const AccidentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()

  const { detail: accident, isLoading } = useDetail<Accident>('/accidents', id, !!id)
  const { data: hfoData } = useData<any>(`/hf/${accident?.hfId}`, !!accident?.hfId)

  if (isLoading) return <div>Yuklanmoqda...</div>

  if (!accident) {
    return (
      <Card className="mt-4">
        <CardContent>
          <p className="p-4 text-center">Maʼlumotlar topilmadi</p>
        </CardContent>
      </Card>
    )
  }

  const getStatusBadge = (status?: string | null) => {
    if (!status) return '-'

    let variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'info' | 'warning' | 'success' = 'outline'
    let label = status

    switch (status) {
      case 'NEW':
        variant = 'info'
        label = 'Yangi'
        break
      case 'IN_PROCESS':
        variant = 'warning'
        label = 'Jarayonda'
        break
      case 'COMPLETED':
        variant = 'success'
        label = 'Yakunlangan'
        break
    }

    return <Badge variant={variant}>{label}</Badge>
  }

  const getInjuryStatusText = (status: InjuryStatus) => {
    switch (status) {
      case InjuryStatus.MINOR:
        return 'Yengil'
      case InjuryStatus.SERIOUS:
        return 'Og‘ir'
      case InjuryStatus.FATAL:
        return 'O‘lim'
      default:
        return status
    }
  }

  return (
    <div className="container mx-auto space-y-4 pb-10">
      <div className="flex items-center justify-between">
        <GoBack title="Baxtsiz hodisa tafsilotlari" />
      </div>

      <DetailCardAccordion defaultValue={['accident_info', 'victims', 'files']}>
        <DetailCardAccordion.Item value="legal_info" title="Tashkilot to‘g‘risida ma’lumot">
          {accident.legalTin && <LegalApplicantInfo tinNumber={accident.legalTin} />}
        </DetailCardAccordion.Item>

        <DetailCardAccordion.Item value="object_info" title="XICHO to‘g‘risida ma’lumot">
          <AppealMainInfo data={hfoData} type="HF" address={hfoData?.address} />
        </DetailCardAccordion.Item>

        <DetailCardAccordion.Item value="accident_info" title="Baxtsiz hodisa tafsilotlari">
          <div className="flex flex-col gap-1 p-4">
            <DetailRow title="Sana:" value={accident.date ? format(new Date(accident.date), 'dd.MM.yyyy') : '-'} />
            <DetailRow title="Qisqacha tafsilot:" value={accident.shortDetail || '-'} />
            <DetailRow title="Holati:" value={getStatusBadge(accident.status)} />
            <DetailRow title="Baxtsiz hodisaning shart-sharoitlari:" value={accident.conditions || '-'} />
            <DetailRow
              title="Hujjat qaysi huquqni muhofaza qiluvchi organlarga yuborilgan, xat sanasi va raqami:"
              value={accident.lettersInfo || '-'}
            />
            <DetailRow title="Baxtsiz hodisa asosiy sabablari tahlili va muammolar:" value={accident.analyses || '-'} />
            <DetailRow
              title="Sanoat xavfsizligi davlat qo‘mitasi hay’ati va korxona tomonidan ko‘rilgan profilaktik choralar:"
              value={accident.preventions || '-'}
            />
            <DetailRow
              title="Baxtsiz hodisaning oldini olish va shunday holatlar takrorlanmasligi uchun berilgan takliflar:"
              value={accident.recommendations || '-'}
            />
          </div>
        </DetailCardAccordion.Item>

        <DetailCardAccordion.Item value="victims" title="Jabrlanuvchilar">
          <div className="flex flex-col gap-6 p-4">
            {accident.victims?.map((victim: any, index: number) => (
              <div key={index} className="flex flex-col gap-2 border-b pb-4 last:border-0 last:pb-0">
                <h4 className="text-lg font-semibold">
                  {index + 1}-jabrlanuvchi: {victim.fullName}
                </h4>
                <div className="flex flex-col gap-1">
                  <DetailRow
                    title="Tug‘ilgan sanasi:"
                    value={victim.birthDate ? format(new Date(victim.birthDate), 'dd.MM.yyyy') : '-'}
                  />
                  <DetailRow title="Yashash manzili:" value={victim.address || '-'} />
                  <DetailRow title="Egallagan lavozimi:" value={victim.position || '-'} />
                  <DetailRow title="Ish tajribasi (yil):" value={victim.experience ? `${victim.experience}` : '-'} />
                  <DetailRow title="Oilaviy ahvoli:" value={victim.maritalStatus || '-'} />
                  <DetailRow
                    title="Sodir bo‘lgan baxtsiz hodisa oqibati:"
                    value={<span className="font-bold">{getInjuryStatusText(victim.injuryStatus)}</span>}
                  />
                </div>
              </div>
            ))}
            {(!accident.victims || accident.victims.length === 0) && (
              <p className="text-muted-foreground">Jabrlanuvchilar yo‘q</p>
            )}
          </div>
        </DetailCardAccordion.Item>

        <DetailCardAccordion.Item value="files" title="Ilovalar">
          <FilesSection
            files={[
              {
                label: 'Maxsus tekshirish dalolatnomasi',
                fieldName: 'specialActPath',
                data: { path: accident.specialActPath || '', number: '', uploadDate: '', expiryDate: '' },
              },
              {
                label: 'N-1 shaklidagi dalolatnoma',
                fieldName: 'n1ActPath',
                data: { path: accident.n1ActPath || '', number: '', uploadDate: '', expiryDate: '' },
              },
              {
                label: 'Rejalar, sxemalar, tekshirish protokoli va baxtsiz hodisa yuz bergan joyning fotosuratlari',
                fieldName: 'planSchemaPath',
                data: { path: accident.planSchemaPath || '', number: '', uploadDate: '', expiryDate: '' },
              },
              {
                label: 'Maxsus tekshirish komissiyasi tuzish haqidagi buyruq yoki qaror',
                fieldName: 'commissionOrderPath',
                data: { path: accident.commissionOrderPath || '', number: '', uploadDate: '', expiryDate: '' },
              },
              {
                label: 'So‘roqlar protokoli va boshqa baxtsiz hodisaga aloqador hujjatlar to‘plami',
                fieldName: 'protocolPath',
                data: { path: accident.protocolPath || '', number: '', uploadDate: '', expiryDate: '' },
              },
            ]}
          />
        </DetailCardAccordion.Item>
      </DetailCardAccordion>
    </div>
  )
}
