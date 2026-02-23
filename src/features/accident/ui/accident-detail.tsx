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
import { Accident, AccidentNonInjury, InjuryStatus } from '../model/types'
import { format } from 'date-fns'
import { getStatusBadge } from '@/features/accident/ui/accident-list.tsx'

export const AccidentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()

  const { detail: accident, isLoading } = useDetail<Accident | AccidentNonInjury>('/accidents', id, !!id)
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

  const isInjury = accident.type === 'INJURY'
  const isNonInjury = accident.type === 'NON_INJURY'

  const getInjuryStatusText = (status: InjuryStatus) => {
    switch (status) {
      case InjuryStatus.MINOR:
        return 'Yengil (guruhiy)'
      case InjuryStatus.SERIOUS:
        return 'O‘gir'
      case InjuryStatus.FATAL:
        return 'O‘lim'
      default:
        return status
    }
  }

  return (
    <div className="container mx-auto space-y-4 pb-10">
      <div className="flex items-center justify-between">
        <GoBack title={isInjury ? 'Baxtsiz hodisa tafsilotlari' : 'Avariya tafsilotlari'} />
      </div>

      <DetailCardAccordion defaultValue={isInjury ? ['accident_info', 'victims', 'files'] : ['accident_info', 'files']}>
        <DetailCardAccordion.Item value="legal_info" title="Tashkilot to‘g‘risida maʼlumot">
          {accident.legalTin && <LegalApplicantInfo tinNumber={accident.legalTin} />}
        </DetailCardAccordion.Item>

        <DetailCardAccordion.Item value="object_info" title="XICHO to‘g‘risida maʼlumot">
          <AppealMainInfo data={hfoData} type="HF" address={hfoData?.address} />
        </DetailCardAccordion.Item>

        {isInjury && (
          <DetailCardAccordion.Item value="accident_info" title="Baxtsiz hodisa tafsilotlari">
            <div className="flex flex-col gap-1 p-4">
              <DetailRow
                title="Sana:"
                value={(accident as Accident).date ? format(new Date((accident as Accident).date), 'dd.MM.yyyy') : '-'}
              />
              <DetailRow title="Qisqacha tafsilot:" value={accident.shortDetail || '-'} />
              <DetailRow title="Holati:" value={getStatusBadge(accident.status)} />
              <DetailRow
                title="Baxtsiz hodisaning shart-sharoitlari:"
                value={(accident as Accident).conditions || '-'}
              />
              <DetailRow
                title="Hujjat qaysi huquqni muhofaza qiluvchi organlarga yuborilgan, xat sanasi va raqami:"
                value={(accident as Accident).lettersInfo || '-'}
              />
              <DetailRow
                title="Baxtsiz hodisa asosiy sabablari tahlili va muammolar:"
                value={(accident as Accident).analyses || '-'}
              />
              <DetailRow
                title="Sanoat xavfsizligi davlat qo'mitasi hay'ati va korxona tomonidan ko'rilgan profilaktik choralar:"
                value={(accident as Accident).preventions || '-'}
              />
              <DetailRow
                title="Baxtsiz hodisaning oldini olish va shunday holatlar takrorlanmasligi uchun berilgan takliflar:"
                value={(accident as Accident).recommendations || '-'}
              />
            </div>
          </DetailCardAccordion.Item>
        )}

        {isNonInjury && (
          <DetailCardAccordion.Item value="accident_info" title="Avariya tafsilotlari">
            <div className="flex flex-col gap-1 p-4">
              <DetailRow
                title="Avariya yuz bergan vaqt va sana:"
                value={
                  (accident as AccidentNonInjury).dateTime
                    ? format(new Date((accident as AccidentNonInjury).dateTime), 'dd.MM.yyyy, HH:mm')
                    : '-'
                }
              />
              <DetailRow title="Avariyaning qisqacha tavsifi:" value={accident.shortDetail || '-'} />
              <DetailRow title="Holati:" value={getStatusBadge(accident.status)} />
              <DetailRow
                title="Avariyadan koʻrilgan iqtisodiy zarar (soʻm):"
                value={(accident as AccidentNonInjury).economicLoss || '-'}
              />
              <DetailRow
                title="Obyektdan foydalanish toʻxtatilgan vaqt:"
                value={
                  (accident as AccidentNonInjury).stoppedFrom
                    ? format(new Date((accident as unknown as any).stoppedFrom), 'dd.MM.yyyy, HH:mm')
                    : '-'
                }
              />
              <DetailRow
                title="Obyektdan foydalanish qaytadan boshlangan vaqt:"
                value={
                  (accident as AccidentNonInjury).stoppedTo
                    ? format(new Date((accident as unknown as any).stoppedTo), 'dd.MM.yyyy, HH:mm')
                    : '-'
                }
              />
              <DetailRow
                title="Avariyaning yuz berishida aybdor boʻlgan xodimlar va ularga nisbatan qoʻllanilgan intizomiy jazo:"
                value={(accident as AccidentNonInjury).guiltyEmployees || '-'}
              />
              <DetailRow
                title="Komissiya xulosasiga asosan yuz bergan avariya oqibatlarini bartaraf etish boʻyicha koʻrilgan chora-tadbirlar:"
                value={(accident as AccidentNonInjury).preventions || '-'}
              />
              <DetailRow
                title="Chora-tadbirlar rejasining bajarilishi toʻgʻrisida maʼlumotlar:"
                value={(accident as AccidentNonInjury).executions || '-'}
              />
            </div>
          </DetailCardAccordion.Item>
        )}

        {isInjury && (
          <DetailCardAccordion.Item value="victims" title="Jabrlanuvchilar">
            <div className="flex flex-col gap-6 p-4">
              {(accident as Accident).victims?.map((victim: any, index: number) => (
                <div key={index} className="flex flex-col gap-2 border-b pb-4 last:border-0 last:pb-0">
                  <h4 className="text-lg font-semibold">
                    {index + 1}-jabrlanuvchi: {victim.fullName}
                  </h4>
                  <div className="flex flex-col gap-1">
                    <DetailRow
                      title="Tug'ilgan sanasi:"
                      value={victim.birthDate ? format(new Date(victim.birthDate), 'dd.MM.yyyy') : '-'}
                    />
                    <DetailRow title="Yashash manzili:" value={victim.address || '-'} />
                    <DetailRow title="Egallagan lavozimi:" value={victim.position || '-'} />
                    <DetailRow title="Ish tajribasi (yil):" value={victim.experience ? `${victim.experience}` : '-'} />
                    <DetailRow title="Oilaviy ahvoli:" value={victim.maritalStatus || '-'} />
                    <DetailRow
                      title="Sodir bo'lgan baxtsiz hodisa oqibati:"
                      value={<span className="font-bold">{getInjuryStatusText(victim.injuryStatus)}</span>}
                    />
                  </div>
                </div>
              ))}
              {(!(accident as Accident).victims || (accident as Accident).victims?.length === 0) && (
                <p className="text-muted-foreground">Jabrlanuvchilar yo‘q</p>
              )}
            </div>
          </DetailCardAccordion.Item>
        )}

        <DetailCardAccordion.Item value="files" title="Ilovalar">
          {isInjury && (
            <FilesSection
              files={[
                {
                  label: 'Maxsus tekshirish dalolatnomasi',
                  fieldName: 'specialActPath',
                  data: {
                    path: (accident as Accident).specialActPath || '',
                    number: '',
                    uploadDate: '',
                    expiryDate: '',
                  },
                },
                {
                  label: 'N-1 shaklidagi dalolatnoma',
                  fieldName: 'n1ActPath',
                  data: { path: (accident as Accident).n1ActPath || '', number: '', uploadDate: '', expiryDate: '' },
                },
                {
                  label: 'Rejalar, sxemalar, tekshirish protokoli va baxtsiz hodisa yuz bergan joyning fotosuratlari',
                  fieldName: 'planSchemaPath',
                  data: {
                    path: (accident as Accident).planSchemaPath || '',
                    number: '',
                    uploadDate: '',
                    expiryDate: '',
                  },
                },
                {
                  label: 'Maxsus tekshirish komissiyasi tuzish haqidagi buyruq yoki qaror',
                  fieldName: 'commissionOrderPath',
                  data: {
                    path: (accident as Accident).commissionOrderPath || '',
                    number: '',
                    uploadDate: '',
                    expiryDate: '',
                  },
                },
                {
                  label: 'So‘roqlar protokoli va boshqa baxtsiz hodisaga aloqador hujjatlar to‘plami',
                  fieldName: 'othersPath',
                  data: { path: (accident as Accident).othersPath || '', number: '', uploadDate: '', expiryDate: '' },
                },
              ]}
            />
          )}
          {isNonInjury && (
            <FilesSection
              files={[
                {
                  label: 'Buyruq',
                  fieldName: 'commissionOrderPath',
                  data: {
                    path: (accident as AccidentNonInjury).commissionOrderPath || '',
                    number: '',
                    uploadDate: '',
                    expiryDate: '',
                  },
                },
                {
                  label: 'Maxsus tekshirish dalolatnomasi',
                  fieldName: 'specialActPath',
                  data: {
                    path: (accident as AccidentNonInjury).specialActPath || '',
                    number: '',
                    uploadDate: '',
                    expiryDate: '',
                  },
                },
                {
                  label: 'Avariyaga aloqador boshqa hujjatlar to‘plami',
                  fieldName: 'othersPath',
                  data: {
                    path: (accident as AccidentNonInjury).othersPath || '',
                    number: '',
                    uploadDate: '',
                    expiryDate: '',
                  },
                },
              ]}
            />
          )}
        </DetailCardAccordion.Item>
      </DetailCardAccordion>
    </div>
  )
}
