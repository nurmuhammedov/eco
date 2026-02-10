export const REGION_MAPPING = [
  { name: 'Jizzax viloyati', id: 14 },
  { name: 'Buxoro viloyati', id: 12 },
  { name: 'Namangan viloyati', id: 6 },
  { name: 'Xorazm viloyati', id: 7 },
  { name: 'Navoiy viloyati', id: 3 },
  { name: 'Sirdaryo viloyati', id: 17 },
  { name: 'Farg‘ona viloyati', id: 13 },
  { name: 'Andijon viloyati', id: 5 },
  { name: 'Samarqand viloyati', id: 2 },
  { name: 'Toshkent shahri', id: 1 },
  { name: 'Qoraqalpog‘iston Respublikasi', id: 16 },
  { name: 'Qashqadaryo viloyati', id: 15 },
  { name: 'Surxondaryo viloyati', id: 18 },
  { name: 'Toshkent viloyati', id: 4 },
]

export const getRegionIdByName = (name: string): number | null => {
  const region = REGION_MAPPING.find((r) => r.name === name)
  return region ? region.id : null
}

export const getRegionNameById = (id: number): string => {
  const region = REGION_MAPPING.find((r) => r.id === id)
  return region ? region.name : ''
}
