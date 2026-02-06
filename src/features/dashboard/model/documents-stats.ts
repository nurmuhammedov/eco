export const DOCUMENTS_STATS = {
  inquiries: {
    label: 'Murojaatlar',
    total: 1250,
    hf: 350, // XICHO
    equipment: 650, // Qurilmalar
    irs: 150, // INM
    xray: 100, // Rentgen
    byRegion: [
      { name: 'Toshkent sh.', count: 450, percentage: 36 },
      { name: 'Toshkent vil.', count: 200, percentage: 16 },
      { name: 'Samarqand vil.', count: 150, percentage: 12 },
      { name: 'Farg‘ona vil.', count: 120, percentage: 10 },
      { name: 'Andijon vil.', count: 100, percentage: 8 },
      { name: 'Namangan vil.', count: 80, percentage: 6 },
      { name: 'Buxoro vil.', count: 60, percentage: 5 },
      { name: 'Qashqadaryo vil.', count: 50, percentage: 4 },
      { name: 'Boshqa hududlar', count: 40, percentage: 3 },
    ],
  },
  permits: {
    label: 'Ruhsatnomalar',
    total: 1250,
    permit: 450, // Ruxsatnoma
    license: 300, // Litsenziya
    conclusion: 500, // Xulosa
  },
  expertises: {
    label: 'Ekspertizalar',
    total: 3200,
    lh: 1200, // Loyiha hujjatlari
    tq: 800, // Texnika qurilmalari
    bi: 600, // Binolar va inshootlar
    xd: 400, // Sanoat xavfsizligi deklaratsiyasi
    ix: 200, // Identifikatsiya
  },
}
