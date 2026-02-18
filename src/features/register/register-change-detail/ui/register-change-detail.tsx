import { FC } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDetail } from '@/shared/hooks'
import DetailRow from '@/shared/components/common/detail-row'
import { getDate } from '@/shared/utils/date'
import ChangeLogTable from './parts/change-log-table'
import { DetailCardAccordion } from '@/shared/components/common/detail-card'
import { ApplicationStatusRow } from '@/shared/components/common/application-status-row'
import { GoBack } from '@/shared/components/common'
import LegalApplicantInfo from '@/features/application/application-detail/ui/parts/legal-applicant-info'

const RegisterChangeDetail: FC = () => {
  const { id, type } = useParams<{ id: string; type: string }>()

  const { detail: changeDetail } = useDetail<any>('/changes/by-belong', id, !!id)

  const changeId = changeDetail?.id
  const isLegal = changeDetail?.ownerIdentity?.toString()?.length === 9

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto p-4">
      <GoBack title="O‘zgartirish so‘rovi" />

      <DetailCardAccordion defaultValue={['general', 'applicant', 'logs']}>
        <DetailCardAccordion.Item value="general" title="So‘rov va ijro to‘g‘risida ma’lumot">
          <div className="flex flex-col py-1">
            <DetailRow
              title="Reyestr ma’lumotlari:"
              value={
                <Link className="text-[#0271FF]" to={`/register/${changeDetail?.belongId}/${type}`}>
                  Ko‘rish
                </Link>
              }
            />
            <DetailRow title="So‘rov sanasi:" value={getDate(changeDetail?.createdAt)} />
            <ApplicationStatusRow status={changeDetail?.status} title="So‘rov holati:" />
          </div>
        </DetailCardAccordion.Item>

        <DetailCardAccordion.Item value="applicant" title="Arizachi to‘g‘risida ma’lumot">
          {isLegal ? (
            <LegalApplicantInfo tinNumber={changeDetail?.ownerIdentity} />
          ) : (
            <div className="flex flex-col py-1">
              <DetailRow title="Arizachi JSHIR:" value={changeDetail?.ownerIdentity || '-'} />
              <DetailRow title="Arizachi F.I.SH.:" value={changeDetail?.directorName || '-'} />
              <DetailRow title="Arizachining manzili:" value={changeDetail?.address || '-'} />
            </div>
          )}
        </DetailCardAccordion.Item>

        <DetailCardAccordion.Item value="logs" title="O‘zgartirishlar tarixi">
          <div className="py-2">
            <ChangeLogTable changeId={changeId} />
          </div>
        </DetailCardAccordion.Item>
      </DetailCardAccordion>
    </div>
  )
}

export default RegisterChangeDetail
