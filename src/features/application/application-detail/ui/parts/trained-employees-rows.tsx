import DetailRow from '@/shared/components/common/detail-row'
import { EmptyValue } from '@/shared/components/common/empty-value'
import { useData } from '@/shared/hooks'

interface TrainedEmployees {
  managerCount: number | null
  engineerCount: number | null
}

/** Staff the organization has had trained at the partner training centre */
export const TrainedEmployeesRows = ({ tinNumber }: { tinNumber: string }) => {
  const { data } = useData<TrainedEmployees>('/integration/ktnu/trained-employees', !!tinNumber, {
    legalTin: tinNumber,
  })

  return (
    <>
      <DetailRow
        title="“Kontexnazoratoʻquv” DMda malaka oshirgan rahbar xodimlar soni:"
        value={data?.managerCount ?? <EmptyValue />}
      />
      <DetailRow
        title="“Kontexnazoratoʻquv” DMda malaka oshirgan muhandis-texnik xodimlar soni:"
        value={data?.engineerCount ?? <EmptyValue />}
      />
    </>
  )
}
