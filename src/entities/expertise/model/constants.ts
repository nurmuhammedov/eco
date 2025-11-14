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
