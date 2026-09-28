import { ExpertiseTypeEnum } from '@/entities/expertise/model/constants'
import type { ConclusionPayload } from '@/entities/expertise/model/conclusion.types'
import type { AddExpertiseFormValues } from '@/entities/expertise/model/expertise.types'

/** The form's numbers go out as numbers; the three declaration files only with a declaration */
export const toConclusionPayload = ({
  customerTin,
  regionId,
  districtId,
  declarationFilePath,
  calculationLetterPath,
  informationNotePath,
  ...values
}: AddExpertiseFormValues): ConclusionPayload => ({
  ...values,
  customerTin: Number(customerTin),
  regionId: Number(regionId),
  districtId: Number(districtId),
  ...(values.type === ExpertiseTypeEnum.XD && { declarationFilePath, calculationLetterPath, informationNotePath }),
})
