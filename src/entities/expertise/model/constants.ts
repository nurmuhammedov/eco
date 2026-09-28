export enum ExpertiseTypeEnum {
  LH = 'LH',
  TQ = 'TQ',
  BI = 'BI',
  XD = 'XD',
  IX = 'IX',
}

/** AccreditationStatus: a legal entity without an accreditation files declarations as their own customer */
export enum AccreditationStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  EXPIRING_SOON = 'EXPIRING_SOON',
  STOPPED = 'STOPPED',
  NOT_PERMITTED = 'NOT_PERMITTED',
}

export const ExpertiseTypeOptions = [
  {
    value: ExpertiseTypeEnum.LH,
    label:
      'Xavfli ishlab chiqarish obyektini qurish, kengaytirish, qayta qurish, texnik jihatdan qayta jihozlash, konservatsiyalash va tugatishga doir loyiha hujjatlari (LH)',
  },
  {
    value: ExpertiseTypeEnum.TQ,
    label: 'Xavfli ishlab chiqarish obyektida qo‘llaniladigan texnika qurilmalari (TQ)',
  },
  {
    value: ExpertiseTypeEnum.BI,
    label: 'Xavfli ishlab chiqarish obyektidagi binolar va inshootlar (BI)',
  },
  {
    value: ExpertiseTypeEnum.XD,
    label: 'Sanoat xavfsizligi deklaratsiyasi (XD)',
  },
  {
    value: ExpertiseTypeEnum.IX,
    label: 'Xavfli ishlab chiqarish obyektlarini identifikatsiyalash (IX)',
  },
]

export enum ExpertiseSubTypeEnum {
  XICH = 'XICH',
  ILOY = 'ILOY',
  LHUJ = 'LHUJ',
  GILO = 'GILO',
  SXDE = 'SXDE',
  SXEX = 'SXEX',
  IHEK = 'IHEK',
  TEIA = 'TEIA',
  XISX = 'XISX',
  INIL = 'INIL',
  IHUJ = 'IHUJ',
  ILYS = 'ILYS',
  SXBI = 'SXBI',
  LHSX = 'LHSX',
  BINO = 'BINO',
  BISX = 'BISX',
  OMBO = 'OMBO',
  OBIQ = 'OBIQ',
  TQSX = 'TQSX',
}
