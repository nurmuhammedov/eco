import DetailRow from '@/shared/components/common/detail-row'
import { EmptyValue } from '@/shared/components/common/empty-value'
import { useTrainedEmployeesQuery, type TrainedEmployees } from '@/entities/organizations'

/**
 * Staff the organization has had trained at the partner training centre. A
 * null is "not synced yet" and reads as no data, never as 0.
 */
export const TrainedEmployeesCountRows = ({ counts }: { counts: TrainedEmployees | null | undefined }) => (
  <>
    <DetailRow
      title="“Kontexnazoratoʻquv” DMda malaka oshirgan rahbar xodimlar soni:"
      value={counts?.managerCount ?? <EmptyValue />}
    />
    <DetailRow
      title="“Kontexnazoratoʻquv” DMda malaka oshirgan muhandis-texnik xodimlar soni:"
      value={counts?.engineerCount ?? <EmptyValue />}
    />
  </>
)

/**
 * The same rows asked of the training centre live. Only for the records whose
 * response does not carry the counts yet - an XICHO's does since 2026-11-12.
 */
export const TrainedEmployeesRows = ({ tinNumber }: { tinNumber: string | number }) => {
  const { data } = useTrainedEmployeesQuery(tinNumber)

  return <TrainedEmployeesCountRows counts={data} />
}
