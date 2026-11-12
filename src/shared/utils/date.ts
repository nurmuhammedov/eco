export function formatDate(isoDateString: string | null | undefined): string {
  if (!isoDateString) return ''
  const date = new Date(isoDateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${day}.${month}.${year}, ${hours}:${minutes}`
}

export const getDate = (dateStr?: string | null): string => {
  let date: Date

  if (dateStr) {
    date = new Date(dateStr)
    if (isNaN(date.getTime())) return ''
  } else {
    return ''
  }

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${day}.${month}.${year}`
}

export const MONTHS = [
  { id: 'JANUARY', name: 'Yanvar' },
  { id: 'FEBRUARY', name: 'Fevral' },
  { id: 'MARCH', name: 'Mart' },
  { id: 'APRIL', name: 'Aprel' },
  { id: 'MAY', name: 'May' },
  { id: 'JUNE', name: 'Iyun' },
  { id: 'JULY', name: 'Iyul' },
  { id: 'AUGUST', name: 'Avgust' },
  { id: 'SEPTEMBER', name: 'Sentabr' },
  { id: 'OCTOBER', name: 'Oktabr' },
  { id: 'NOVEMBER', name: 'Noyabr' },
  { id: 'DECEMBER', name: 'Dekabr' },
]

export const QUARTERS = [
  { id: '1', name: '1-chorak' },
  { id: '2', name: '2-chorak' },
  { id: '3', name: '3-chorak' },
  { id: '4', name: '4-chorak' },
]

/** For checking a quarter from the URL: anything else is a 400 from the backend */
export const QUARTER_IDS = QUARTERS.map((item) => item.id)

/**
 * Xavf tahlili choraklik (2026-11-12 dan backend oyni emas, chorakni so'raydi):
 * the newest finished quarter, the one before the current.
 */
export const getDefaultYearAndQuarterForRiskAnalysis = (date = new Date()) => {
  const currentQuarter = Math.floor(date.getMonth() / 3) + 1

  return currentQuarter === 1
    ? { year: String(date.getFullYear() - 1), quarter: '4' }
    : { year: String(date.getFullYear()), quarter: String(currentQuarter - 1) }
}

export const getDefaultYearAndMonthForInspections = () => {
  // Joriy chorakning birinchi oyi
  const date = new Date()
  const currentQuarter = Math.floor(date.getMonth() / 3) + 1
  const targetYear = date.getFullYear()
  const targetMonthIndex = (currentQuarter - 1) * 3

  return {
    year: targetYear.toString(),
    month: MONTHS[targetMonthIndex].id,
  }
}
