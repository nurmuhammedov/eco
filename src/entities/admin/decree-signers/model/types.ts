import type { SearchParamValue } from '@/shared/types/api'

/** DecreeBelongType: the inspections whose decrees a signer signs */
export type DecreeBelongType = 'IRS_XRAY' | 'OTHER'

/** DecreeSigner (`GET /decree-signers`) */
export interface DecreeSigner {
  id: number
  userId: string | null
  fullName: string | null
  position: string | null
  belongType: DecreeBelongType | null
}

/** DecreeSignerDto */
export interface CreateDecreeSignerDto {
  userId: string
  belongType: DecreeBelongType
}

export type DecreeSignersParams = {
  page?: number
  size?: number
  belongType?: DecreeBelongType
} & Record<string, SearchParamValue>
