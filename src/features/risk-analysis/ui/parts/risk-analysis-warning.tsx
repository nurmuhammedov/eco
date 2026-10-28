import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import { ArrowRight, ClipboardCheck } from 'lucide-react'
import DetailRow from '@/shared/components/common/detail-row'
import FileLink from '@/shared/components/common/file-link'
import { Button } from '@/shared/components/ui/button'
import { useAuth } from '@/shared/hooks/use-auth'
import { useCustomSearchParams } from '@/shared/hooks'
import { useEimzo } from '@/shared/hooks/use-eimzo'
import { UserRoles } from '@/shared/types/user'
import { ApplicationModal } from '@/features/application/create-application'
import RiskAnalysisForm from './risk-analysis-form'
import { RiskLevelBadge, canHaveWarning, postalMailStatusLabel } from './risk-level'
import type { RiskAnalysisData } from '../risk-analysis'
import type { RiskAnalysisLevel } from '@/entities/risk-analysis/model/risk-analysis.types'

const day = (value?: string | null) => (value ? format(new Date(value), 'dd.MM.yyyy') : '—')

/**
 * Tavsiyanoma: the same PDF → E-IMZO → hybrid mail flow as the inspection's
 * notification letter. Only a regional head (supervisors sign in as REGIONAL)
 * can form one, only for MEDIUM/HIGH, and only once.
 */
export const useCanSendWarning = (level?: RiskAnalysisLevel | null, warningDate?: string | null) => {
  const { user } = useAuth()
  return user?.role === UserRoles.REGIONAL && canHaveWarning(level) && !warningDate
}

/** The button with its own PDF → E-IMZO → send flow, so a table row can carry it too. */
export const WarningFormButton = ({ riskAnalysisId }: { riskAnalysisId: string }) => {
  const {
    error,
    isLoading,
    documentUrl,
    hashCode,
    isModalOpen,
    isPdfLoading,
    handleCloseModal,
    handleCreateApplication,
    submitApplicationMetaData,
  } = useEimzo({
    pdfEndpoint: `/risk-analyses/${riskAnalysisId}/warning/generate-pdf`,
    submitEndpoint: `/risk-analyses/${riskAnalysisId}/warning`,
    invalidates: '/risk-analyses',
    successMessage: 'Tavsiyanoma yuborildi',
    // The endpoint takes only the file and the signature - no `dto`.
    transformSubmitPayload: (_dto, sign, filePath) => ({ filePath, sign }),
  })

  return (
    <>
      <Button size="sm" loading={isPdfLoading} onClick={() => handleCreateApplication({})}>
        Tavsiyanoma shakllantirish
      </Button>
      <ApplicationModal
        error={error}
        isOpen={isModalOpen}
        isLoading={isLoading}
        documentUrl={documentUrl || ''}
        hashCode={hashCode}
        isPdfLoading={isPdfLoading}
        onClose={handleCloseModal}
        submitApplicationMetaData={submitApplicationMetaData}
      />
    </>
  )
}

export const RiskAnalysisWarning = ({ data }: { data: RiskAnalysisData }) => {
  const canSend = useCanSendWarning(data.level, data.warningDate)

  if (data.warningDate) {
    return (
      <div className="mb-4 rounded-lg border p-4">
        <h6 className="mb-2 text-sm font-semibold text-gray-700">Tavsiyanoma</h6>
        <DetailRow title="Yuborilgan sana" value={day(data.warningDate)} />
        <DetailRow title="Pochta holati" value={postalMailStatusLabel(data.warningStatus)} />
        <DetailRow
          title="Tavsiyanoma fayli"
          value={data.warningPath ? <FileLink url={data.warningPath} title="PDF’ni ko‘rish" /> : '—'}
        />
      </div>
    )
  }

  if (!canSend) return null

  return (
    <div className="mb-4 flex items-center justify-between rounded-lg border p-4">
      <div>
        <h6 className="text-sm font-semibold text-gray-700">Tavsiyanoma</h6>
        <p className="text-sm text-neutral-500">Ushbu havf tahlili bo‘yicha tavsiyanoma hali yuborilmagan</p>
      </div>
      <WarningFormButton riskAnalysisId={data.id} />
    </div>
  )
}

/**
 * The admin-run recheck of the quarter's HIGH analyses. Only MEDIUM and HIGH
 * results go on to a warning and a recheck, so a LOW one says it is not needed.
 */
export const RiskAnalysisRecheckResult = ({ data }: { data: RiskAnalysisData }) => {
  if (!data.recheckAt) {
    return (
      <p className="py-3 text-sm text-neutral-500">
        {canHaveWarning(data.level)
          ? 'Qayta xavf tahlili hali o‘tkazilmagan'
          : 'Xavfi past bo‘lgani uchun qayta xavf tahlili talab qilinmaydi'}
      </p>
    )
  }

  return (
    <>
      <DetailRow title="O‘tkazilgan vaqti" value={format(new Date(data.recheckAt), 'dd.MM.yyyy HH:mm')} />
      <DetailRow title="Ballar" value={`${data.totalScore ?? '—'} → ${data.recheckTotalScore ?? '—'}`} />
      <DetailRow title="Daraja" value={<RiskLevelBadge level={data.recheckLevel} />} />
      <div className="mt-3">
        <RiskAnalysisForm data={data.recheckIndicators ?? null} />
      </div>
    </>
  )
}

/** The inspection the analysis led to, if it led to one. */
export const RiskAnalysisInspectionLink = ({ data }: { data: RiskAnalysisData }) => {
  const {
    paramsObject: { name },
  } = useCustomSearchParams()

  if (!data.inspectionId) return null

  // the inspection page heads itself with the organisation, so it gets the same tin and name
  const inspectionQuery = new URLSearchParams({
    inspectionId: String(data.inspectionId),
    tin: String(data.identity ?? ''),
    name: String(name ?? ''),
  })

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-teal-200 bg-teal-50/60 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700">
          <ClipboardCheck className="size-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">Tekshiruv yaratilgan</p>
          <p className="text-xs text-neutral-500">Ushbu xavf tahlili natijasi asosida tekshiruv tayinlangan</p>
        </div>
      </div>
      <Button asChild size="sm" variant="outline" className="shrink-0">
        <Link to={`/inspections/info?${inspectionQuery}`}>
          Tekshiruvni ko‘rish
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    </div>
  )
}
