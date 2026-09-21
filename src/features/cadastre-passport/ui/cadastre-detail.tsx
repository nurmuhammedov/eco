import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Edit2, FileQuestion, Loader2, RotateCcw } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Accordion } from '@/shared/components/ui/accordion'
import GoBack from '@/shared/components/common/go-back'
import { DetailCardAccordion } from '@/shared/components/common/detail-card'
import DetailRow from '@/shared/components/common/detail-row'
import FileLink from '@/shared/components/common/file-link'
import { EmptyValue } from '@/shared/components/common/empty-value'
import { useLegalOrganizationQuery } from '@/shared/api/dictionaries'
import { useAuth } from '@/shared/hooks/use-auth'
import { FVV_GROUPS, SES_GROUPS } from '../model/review-fields'
import { canSignAsCommittee, isCustomer, isPreparer } from '../model/permissions'
import { useCadastrePassport } from '../model/use-cadastre-passport'
import { CadastreEditModal } from './components/cadastre-edit-modal'
import { CommitteeActions } from './components/committee-actions'
import { CustomerActions } from './components/customer-actions'
import { PreparerDataRows, RegistryDataRows } from './components/preparer-data-rows'
import { ReviewsList } from './components/reviews-list'
import { SectionRows } from './components/section-rows'
import { StatusBadge } from './components/status-badge'
import { WorkflowActions } from './components/workflow-actions'
import { WorkflowCards } from './components/workflow-cards'

const fileValue = (url: string | null) => (url ? <FileLink url={url} title="Hujjatni ko‘rish" /> : <EmptyValue />)

export default function CadastreDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [editOpen, setEditOpen] = useState(false)

  const { data: passport, isLoading } = useCadastrePassport(id)

  const { data: preparerInfo } = useLegalOrganizationQuery(passport?.preparerTin)
  const { data: customerInfo } = useLegalOrganizationQuery(passport?.customerTin)

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center" aria-busy="true">
        <Loader2 className="size-6 animate-spin text-neutral-400" />
        <span className="sr-only">Yuklanmoqda</span>
      </div>
    )
  }

  if (!passport) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-neutral-100">
          <FileQuestion className="size-6 text-neutral-400" />
        </div>
        <div className="space-y-1">
          <p className="font-medium text-neutral-900">Hujjat topilmadi</p>
          <p className="max-w-sm text-sm text-neutral-500">
            Hujjat o‘chirilgan bo‘lishi yoki sizda unga kirish huquqi bo‘lmasligi mumkin.
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/cadastre-passports')}>
          Ro‘yxatga qaytish
        </Button>
      </div>
    )
  }

  const data = passport.cadastreData
  const workflows = passport.workflows ?? []
  const myWorkflow = passport.status === 'IN_REVIEW' ? workflows.find((workflow) => workflow.myTurn) : undefined

  const canEdit = passport.status === 'NEW' && isPreparer(user, passport)
  const canResubmit = passport.status === 'REJECTED' && isPreparer(user, passport)

  const resubmit = () => {
    const params = new URLSearchParams({
      parentRequestNumber: passport.requestNumber,
      customerTin: String(passport.customerTin),
    })

    navigate(`/cadastre-passports/add?${params}`)
  }

  return (
    <div className="space-y-4 pb-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <GoBack title={`Hujjat tafsiloti ${passport.registryNumber ? `(${passport.registryNumber})` : ''}`} />
        <div className="flex flex-wrap items-center justify-end gap-2">
          {canResubmit && (
            <Button variant="outline" onClick={resubmit}>
              <RotateCcw className="mr-2 size-4" />
              Qayta yuborish
            </Button>
          )}
          {myWorkflow && <WorkflowActions passport={passport} workflow={myWorkflow} />}
          {passport.status === 'NEW' && isCustomer(user, passport) && <CustomerActions passportId={passport.id} />}
          {passport.status === 'IN_COMMITTEE' && canSignAsCommittee(user) && (
            <CommitteeActions passportId={passport.id} />
          )}
        </div>
      </div>

      <Accordion
        type="multiple"
        defaultValue={['txyuz', 'workflows', 'cadastre-data', 'registry-data', 'fvv', 'ses', 'reviews']}
      >
        <DetailCardAccordion.Item value="txyuz" title="TXYUZ kadastr pasporti ma’lumotlari">
          <DetailRow title="Holati" value={<StatusBadge status={passport.status} />} />
          <DetailRow title="Ariza raqami" value={passport.requestNumber || '-'} />
          <DetailRow title="Reyestr raqami" value={passport.registryNumber || '-'} />
          {passport.parentCadastrePassportId && (
            <DetailRow
              title="Oldin yuborilgan pasport"
              value={
                <Link
                  to={`/cadastre-passports/${passport.parentCadastrePassportId}`}
                  className="text-teal hover:underline"
                >
                  Ko‘rish
                </Link>
              }
            />
          )}
          <DetailRow title="Ishlab chiqqan tashkilot nomi" value={preparerInfo?.name || '-'} />
          <DetailRow title="Ishlab chiqqan tashkilot STIR" value={passport.preparerTin || '-'} />
          <DetailRow title="Tashkilot nomi" value={customerInfo?.name || '-'} />
          <DetailRow title="Tashkilot STIR" value={passport.customerTin || '-'} />
          <DetailRow title="Titul va Davlat reyestri fayli" value={fileValue(passport.titlePagePath)} />
          <DetailRow title="TXYUZ ma’lumotlari fayli" value={fileValue(passport.dataPagePath)} />
          <DetailRow title="Kadastr passporti fayli" value={fileValue(passport.passportFilePath)} />
        </DetailCardAccordion.Item>

        <DetailCardAccordion.Item value="workflows" title="Tashkilotlar tomonidan ko‘rib chiqish">
          <div className="py-2">
            <WorkflowCards workflows={workflows} />
          </div>
        </DetailCardAccordion.Item>

        <DetailCardAccordion.Item
          value="cadastre-data"
          title="TXYUZ kadastr pasportining atributiv ma’lumotlari"
          action={
            canEdit ? (
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-neutral-600 hover:bg-white/70 hover:text-neutral-900"
                title="Tahrirlash"
                onClick={() => setEditOpen(true)}
              >
                <Edit2 className="size-4" />
                <span className="sr-only">Tahrirlash</span>
              </Button>
            ) : null
          }
        >
          <PreparerDataRows data={data?.preparerData} />
        </DetailCardAccordion.Item>

        <DetailCardAccordion.Item
          value="registry-data"
          title="TXYUZ kadastr pasporti davlat reyestridan o‘tkazilganligi to‘g‘risida ma’lumotlar"
        >
          <RegistryDataRows data={data?.preparerData} />
        </DetailCardAccordion.Item>

        <DetailCardAccordion.Item value="fvv" title="Favqulodda vaziyatlar vazirligi ma’lumotlari">
          <SectionRows groups={FVV_GROUPS} data={data?.fvvData} />
        </DetailCardAccordion.Item>

        <DetailCardAccordion.Item value="ses" title="Sanitariya-epidemiologik osoyishtalik xizmati ma’lumotlari">
          <SectionRows groups={SES_GROUPS} data={data?.sesData} />
        </DetailCardAccordion.Item>

        <DetailCardAccordion.Item value="reviews" title="Xulosalar">
          <ReviewsList reviews={passport.reviews ?? []} />
        </DetailCardAccordion.Item>
      </Accordion>

      {editOpen && (
        <CadastreEditModal
          isOpen={editOpen}
          onClose={() => setEditOpen(false)}
          cadastreId={passport.id}
          defaultValues={data?.preparerData}
        />
      )}
    </div>
  )
}
