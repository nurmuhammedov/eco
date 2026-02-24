export const DOCUMENTS_STATS = {
  inquiries: {
    label: 'Murojaatlar',
    total: 0,
    hf: 0, // XICHO
    equipment: 0, // Qurilmalar
    irs: 0, // INM
    xray: 0, // Rentgen
    byRegion: [
      { name: 'Toshkent sh.', count: 0, percentage: 0 },
      { name: 'Toshkent vil.', count: 0, percentage: 0 },
      { name: 'Samarqand vil.', count: 0, percentage: 0 },
      { name: 'Farg‘ona vil.', count: 0, percentage: 0 },
      { name: 'Andijon vil.', count: 0, percentage: 0 },
      { name: 'Namangan vil.', count: 0, percentage: 0 },
      { name: 'Buxoro vil.', count: 0, percentage: 0 },
      { name: 'Qashqadaryo vil.', count: 0, percentage: 0 },
      { name: 'Boshqa hududlar', count: 0, percentage: 0 },
    ],
  },
  permits: {
    label: 'Ruhsatnomalar',
    total: 0,
    permit: 0, // Ruxsatnoma
    license: 0, // Litsenziya
    conclusion: 0, // Xulosa
  },
  expertises: {
    label: 'Ekspertizalar',
    total: 0,
    lh: 0, // Loyiha hujjatlari
    tq: 0, // Texnika qurilmalari
    bi: 0, // Binolar va inshootlar
    xd: 0, // Sanoat xavfsizligi deklaratsiyasi
    ix: 0, // Identifikatsiya
  },
}
