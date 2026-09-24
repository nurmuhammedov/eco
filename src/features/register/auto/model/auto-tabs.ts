export enum AutoTabKey {
  ALL = 'ALL',
  OIL_PRODUCTS = 'OIL',
  LPG_TRANSPORT = 'LPG',
  CHEMICALS = 'CHEMICAL',
  CRYOGENIC_GASES = 'CRYOGENIC',
  NUCLEAR_MATERIALS = 'RADIOACTIVE',
}

/** Kinds of dangerous goods an auto registry entry carries */
export const tabs = [
  { key: AutoTabKey.ALL, label: 'Barchasi' },
  { key: AutoTabKey.OIL_PRODUCTS, label: 'Neft mahsulotlarini tashish' },
  { key: AutoTabKey.LPG_TRANSPORT, label: 'Suyultirilgan uglevodorod gazini tashish' },
  { key: AutoTabKey.CHEMICALS, label: 'Kimyoviy moddalarni tashish' },
  { key: AutoTabKey.CRYOGENIC_GASES, label: 'Suyultirilgan va siqilgan kriogen gazini tashish' },
  { key: AutoTabKey.NUCLEAR_MATERIALS, label: 'Yadroviy va radioaktiv materiallarni tashish' },
]
