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

export const getDate = (dateStr?: string): string => {
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

export const getDefaultYearAndMonthForRiskAnalysis = () => {
  // Joriy chorakdan bitta oldingi chorakning uchinchi oyi
  const date = new Date()
  const currentQuarter = Math.floor(date.getMonth() / 3) + 1
  let targetYear = date.getFullYear()
  let previousQuarter = currentQuarter - 1

  if (previousQuarter === 0) {
    previousQuarter = 4
    targetYear -= 1
  }

  const targetMonthIndex = previousQuarter * 3 - 1 // 3rd month of that quarter

  return {
    year: targetYear.toString(),
    month: MONTHS[targetMonthIndex].id,
  }
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
