export enum ExpertiseTypeEnum {
  LH = 'LH',
  TQ = 'TQ',
  BI = 'BI',
  XD = 'XD',
  IX = 'IX',
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
];

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

export const ExpertiseSubTypeOptions = [
  {
    value: ExpertiseSubTypeEnum.XICH,
    label: 'Xavfli ishlab chiqarish obyektlarini identifikatsiya qilish',
    type: ExpertiseTypeEnum.IX,
  },
  {
    value: ExpertiseSubTypeEnum.ILOY,
    label: 'Ishchi loyiha',
    type: ExpertiseTypeEnum.LH,
  },
  {
    value: ExpertiseSubTypeEnum.LHUJ,
    label: 'Loyiha hujjatlari',
    type: ExpertiseTypeEnum.LH,
  },
  {
    value: ExpertiseSubTypeEnum.GILO,
    label: 'Guruhli ishchi loyiha',
    type: ExpertiseTypeEnum.LH,
  },
  {
    value: ExpertiseSubTypeEnum.SXDE,
    label: 'Sanoat xavfsizligi deklaratsiyasi',
    type: ExpertiseTypeEnum.XD,
  },
  {
    value: ExpertiseSubTypeEnum.SXEX,
    label: 'Sanoat xavfsizligi ekspertizasi xulosasi',
    type: ExpertiseTypeEnum.XD, // Rasmda "ХД" (kirillcha) turibdi, buni XD ga to'g'riladim
  },
  {
    value: ExpertiseSubTypeEnum.IHEK,
    label: 'Ishchi hujjatlar ekspertizasi',
    type: ExpertiseTypeEnum.LH,
  },
  {
    value: ExpertiseSubTypeEnum.TEIA,
    label: 'Texnik-iqtisodiy asos (TIA)',
    type: ExpertiseTypeEnum.XD,
  },
  {
    value: ExpertiseSubTypeEnum.XISX,
    label: 'Xavfli obyektlarning sanoat xavfsizligi deklaratsiyasi',
    type: ExpertiseTypeEnum.XD,
  },
  {
    value: ExpertiseSubTypeEnum.INIL,
    label: 'Individual ishchi loyiha',
    type: ExpertiseTypeEnum.LH,
  },
  {
    value: ExpertiseSubTypeEnum.IHUJ,
    label: 'Ishchi hujjatlar',
    type: ExpertiseTypeEnum.LH,
  },
  {
    value: ExpertiseSubTypeEnum.ILYS,
    label: 'Ishchi loyihalar',
    type: ExpertiseTypeEnum.LH,
  },
  {
    value: ExpertiseSubTypeEnum.SXBI,
    label: "Sanoat xavfsizligi bo'yicha ishchi loyiha ekspertizasi",
    type: ExpertiseTypeEnum.LH,
  },
  {
    value: ExpertiseSubTypeEnum.LHSX,
    label: 'Sanoat xavfsizligi ekspertizasi (LHSX)',
    type: ExpertiseTypeEnum.LH,
  },
  {
    value: ExpertiseSubTypeEnum.BINO,
    label: 'Bino',
    type: ExpertiseTypeEnum.BI,
  },
  {
    value: ExpertiseSubTypeEnum.BISX,
    label: 'Sanoat xavfsizligi ekspertizasi (BISX)',
    type: ExpertiseTypeEnum.BI,
  },
  {
    value: ExpertiseSubTypeEnum.OMBO,
    label: 'Ombor',
    type: ExpertiseTypeEnum.BI,
  },
  {
    value: ExpertiseSubTypeEnum.OBIQ,
    label: 'Ombor bino va inshootlarining qurilish konstruksiyalari texnik holatini tekshirish',
    type: ExpertiseTypeEnum.BI,
  },
  {
    value: ExpertiseSubTypeEnum.TQSX,
    label: 'Sanoat xavfsizligi ekspertizasi (TQSX)',
    type: ExpertiseTypeEnum.TQ,
  },
];
