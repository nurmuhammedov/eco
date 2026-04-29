export interface Park {
  id: number
  name: string
  regionId: number
  districtId: number
  address: string
  location: string | null
  regionName?: string
  districtName?: string
}

export interface CreateParkDTO {
  name: string
  regionId: number
  districtId: number
  address: string
  location: string | null
}

export interface UpdateParkDTO extends CreateParkDTO {
  id: number
}

export interface FilterParkDTO {
  [key: string]: any
  name?: string
  regionId?: number
  districtId?: number
  page?: number
  size?: number
}
