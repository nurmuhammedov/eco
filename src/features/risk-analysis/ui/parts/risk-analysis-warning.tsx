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
import { RiskLevelBadge, WarningStateBadge, canHaveWarning, postalMailStatusLabel } from './risk-level'
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

/** A table cell: the button while a warning can still be sent, otherwise its state. */
export const WarningCell = ({
  riskAnalysisId,
  level,
  warningDate,
}: {
  riskAnalysisId: string
  level?: RiskAnalysisLevel | null
  warningDate?: string | null
}) => {
  const canSend = useCanSendWarning(level, warningDate)
  return canSend ? (
    <WarningFormButton riskAnalysisId={riskAnalysisId} />
  ) : (
    <WarningStateBadge level={level} warningDate={warningDate} />
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

/** The admin-run recheck of the month's HIGH analyses, and the inspection it may have led to. */
export const RiskAnalysisRecheck = ({ data }: { data: RiskAnalysisData }) => {
  const {
    paramsObject: { name },
  } = useCustomSearchParams()

  if (!data.recheckAt && !data.inspectionId) return null

  // the inspection page heads itself with the organisation, so it gets the same tin and name
  const inspectionQuery = new URLSearchParams({
    inspectionId: String(data.inspectionId ?? ''),
    tin: String(data.identity ?? ''),
    name: String(name ?? ''),
  })

  return (
    <>
      {data.recheckAt && (
        <div className="mb-4 rounded-lg border p-4">
          <h6 className="mb-2 text-sm font-semibold text-gray-700">Qayta havf tahlili</h6>
          <DetailRow title="Sana" value={data.recheckAt ? format(new Date(data.recheckAt), 'dd.MM.yyyy HH:mm') : '—'} />
          <DetailRow title="Ballar" value={`${data.totalScore ?? '—'} → ${data.recheckTotalScore ?? '—'}`} />
          <DetailRow title="Daraja" value={<RiskLevelBadge level={data.recheckLevel} />} />
          <div className="mt-3">
            <RiskAnalysisForm data={data.recheckIndicators ?? null} />
          </div>
        </div>
      )}
      {data.inspectionId && (
        <div className="mb-4 flex items-center justify-between gap-4 rounded-lg border border-teal-200 bg-teal-50/60 p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700">
              <ClipboardCheck className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Tekshiruv yaratilgan</p>
              <p className="text-xs text-neutral-500">Ushbu havf tahlili natijasi asosida tekshiruv tayinlangan</p>
            </div>
          </div>
          <Button asChild size="sm" variant="outline" className="shrink-0">
            <Link to={`/inspections/info?${inspectionQuery}`}>
              Tekshiruvni ko‘rish
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      )}
    </>
  )
}
