export interface DecreeSigner {
  id: string
  userId: string
  fullName: string
  pinfl: string
  role: string
  belongType: 'IRS_XRAY' | 'OTHER'
  position?: string
}

export interface CreateDecreeSignerDto {
  userId: string
  belongType: 'IRS_XRAY' | 'OTHER'
}
