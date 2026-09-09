/**
 * The GeoJSON carries a stable ISO-style code per feature, which is what ties a
 * polygon to its registry region. Matching on the English `name` instead meant
 * the two Tashkents were told apart by their position in the file.
 */
export const REGIONS: { code: string; id: number; name: string }[] = [
  { code: 'UZTK', id: 1, name: 'Toshkent shahri' },
  { code: 'UZSA', id: 2, name: 'Samarqand viloyati' },
  { code: 'UZNW', id: 3, name: 'Navoiy viloyati' },
  { code: 'UZTO', id: 4, name: 'Toshkent viloyati' },
  { code: 'UZAN', id: 5, name: 'Andijon viloyati' },
  { code: 'UZNG', id: 6, name: 'Namangan viloyati' },
  { code: 'UZXO', id: 7, name: 'Xorazm viloyati' },
  { code: 'UZBU', id: 12, name: 'Buxoro viloyati' },
  { code: 'UZFA', id: 13, name: 'Farg‘ona viloyati' },
  { code: 'UZJI', id: 14, name: 'Jizzax viloyati' },
  { code: 'UZQA', id: 15, name: 'Qashqadaryo viloyati' },
  { code: 'UZQR', id: 16, name: 'Qoraqalpog‘iston Respublikasi' },
  { code: 'UZSI', id: 17, name: 'Sirdaryo viloyati' },
  { code: 'UZSU', id: 18, name: 'Surxondaryo viloyati' },
]

export const REGIONS_SORTED = [...REGIONS].sort((a, b) => a.name.localeCompare(b.name, 'uz'))

const BY_CODE = new Map(REGIONS.map((region) => [region.code, region]))
const BY_ID = new Map(REGIONS.map((region) => [region.id, region]))

export const regionByCode = (code: string) => BY_CODE.get(code)

export const regionNameById = (id: number | null) => (id === null ? null : (BY_ID.get(id)?.name ?? null))
