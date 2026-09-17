/**
 * The month names the API works in, with their Uzbek labels. They used to live
 * inside the prevention widget, which left the pages that need them importing a
 * widget - and the widget importing those pages back.
 */
export const MONTHS = [
  { value: 'JANUARY', label: 'Yanvar', count: 0 },
  { value: 'FEBRUARY', label: 'Fevral', count: 0 },
  { value: 'MARCH', label: 'Mart', count: 0 },
  { value: 'APRIL', label: 'Aprel', count: 0 },
  { value: 'MAY', label: 'May', count: 0 },
  { value: 'JUNE', label: 'Iyun', count: 0 },
  { value: 'JULY', label: 'Iyul', count: 0 },
  { value: 'AUGUST', label: 'Avgust', count: 0 },
  { value: 'SEPTEMBER', label: 'Sentabr', count: 0 },
  { value: 'OCTOBER', label: 'Oktabr', count: 0 },
  { value: 'NOVEMBER', label: 'Noyabr', count: 0 },
  { value: 'DECEMBER', label: 'Dekabr', count: 0 },
]

export const getCurrentMonthEnum = () => MONTHS[new Date().getMonth()].value
