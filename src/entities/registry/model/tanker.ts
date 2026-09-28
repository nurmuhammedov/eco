/** TankerActivityType: the kind of dangerous goods a tanker carries */
export type TankerActivityType = 'OIL' | 'LPG' | 'CHEMICAL' | 'CRYOGENIC' | 'RADIOACTIVE'

/** TankerResById (`GET /tankers/{id}`), the fields the page shows */
export interface TankerDetail {
  id: string | null
  tin: number | null
  pin: number | null
  activityType: TankerActivityType | null
  registerNumber: string | null
  registrationDate: string | null
  expiryDate: string | null
  numberPlate: string | null
  model: string | null
  factoryNumber: string | null
  inventoryNumber: string | null
  capacity: string | null
  capacityUnit: string | null
  checkDate: string | null
  validUntil: string | null
  regionId: number | null
  regionName: string | null
}

/** TankerResByCount (`GET /tankers/count`) */
export interface TankerCount {
  allCount: number | null
  oilCount: number | null
  lpgCount: number | null
  chemicalCount: number | null
  cryogenicCount: number | null
  radioactiveCount: number | null
}
