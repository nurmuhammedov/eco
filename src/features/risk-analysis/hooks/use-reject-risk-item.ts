import { useMutation, useQueryClient } from '@tanstack/react-query'
import { invalidateEndpoint } from '@/shared/lib/query/endpoint-key'
import { riskIndicatorsEndpoint } from '@/features/risk-analysis/model/risk-analysis-endpoints'
import { toast } from 'sonner'
import { riskAnalysisDetailApi } from '@/features/risk-analysis/model/risk-analysis-detail.api'
import { useSearchParams } from 'react-router-dom'

export const idNames = new Map([
  ['hf', 'hazardousFacilityId'],
  ['irs', 'irsId'],
  ['elevator', 'equipmentId'],
  ['attraction', 'equipmentId'],
])

export function useRejectRiskItem() {
  const [searchParams] = useSearchParams()
  const tin = Number(searchParams.get('tin'))
  const id = searchParams.get('id')
  const intervalId = Number(searchParams.get('intervalId'))
  const currentType = searchParams.get('type') || 'equipmentId'
  const currentIdName = idNames.get(currentType)

  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ type, data }: { type: any; data: any }) =>
      await riskAnalysisDetailApi.rejectRiskItem({
        type,
        data: [
          {
            ...data,
            tin,
            intervalId,
            [currentIdName as string]: id,
          },
        ],
      }),
    onSuccess: async () => {
      await invalidateEndpoint(queryClient, riskIndicatorsEndpoint(currentType))
      toast.success('Muvaffaqiyatli saqlandi!')
    },
  })
}
