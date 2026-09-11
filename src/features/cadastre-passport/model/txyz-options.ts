/**
 * The wording comes from the Qisqartirmalar reference the committee issued for
 * the attributive form. Every one of these fields is plain text on the wire, so
 * the lists are a shortcut for the usual answers - anything else is typed in.
 */

/** Texnogen xavf yuqori bo‘lgan zona obyektining vazifasi. */
export const TXYZ_PURPOSES = [
  'Avtomobillarga gaz to‘ldirish kompressor shoxobchasi (AGTKSH)',
  'Avtomobillarga gaz quyish shoxobchasi (AGQSH)',
  'Avtomobillarga yonilg‘i quyish shoxobchasi (AYQSH)',
  'Konteynerli avtomobillarga yonilg‘i quyish shoxobchasi (KAYQSH)',
  'Gaz to‘ldirish shoxobchasi (GTSH)',
  'Gaz to‘ldirish punkti (GTP)',
] as const

/** Ishlab chiqarish, qayta ishlash, saqlash va foydalanish moddasining nomi. */
export const TXYZ_SUBSTANCES = [
  'Siqilgan tabiiy gaz (metan)',
  'Suyultirilgan uglevodorod gazi (propan)',
  'Avtobenzin yonilg‘isi',
  'Dizel yonilg‘isi',
] as const

/** Yong‘in o‘chirish vositasining turi. */
export const TXYZ_FIREFIGHTING_EQUIPMENT = [
  'OP – 1',
  'OP – 2',
  'OP – 3',
  'OP – 5',
  'OP – 10',
  'OP – 50',
  'OP – 100',
] as const

/** Texnogen xavf rivojlanishida ustunlik qiluvchi turi. */
export const TXYZ_DOMINANT_HAZARD_TYPES = [
  'Yong‘in va portlash',
  'Yong‘in',
  'Portlash',
  'Atmosferaga tarqalishi',
] as const

/**
 * 10:01:01:01:01:0123 - five pairs and a four-digit tail, which is what the
 * land registry issues.
 */
export const LAND_CADASTRE_NUMBER_PATTERN = /^\d{2}:\d{2}:\d{2}:\d{2}:\d{2}:\d{4}$/

const GROUPS = [2, 2, 2, 2, 2, 4]

export const LAND_CADASTRE_NUMBER_LENGTH = GROUPS.reduce((sum, size) => sum + size, 0) + GROUPS.length - 1

/** Keeps the colons in place while the digits are typed. */
export const formatLandCadastreNumber = (raw: string) => {
  const digits = raw.replace(/\D/g, '').slice(
    0,
    GROUPS.reduce((sum, size) => sum + size, 0)
  )

  const parts: string[] = []
  let index = 0

  for (const size of GROUPS) {
    if (index >= digits.length) break

    parts.push(digits.slice(index, index + size))
    index += size
  }

  return parts.join(':')
}

/**
 * The stored address is "<region>, <district>, <rest>" - what the form joined on
 * the way out. Splitting on the first two commas gives the parts back; an
 * address saved before this form existed simply keeps everything in the last
 * part, which is still the truth about it.
 */
export const splitAddress = (address?: string | null) => {
  const parts = String(address ?? '')
    .split(',')
    .map((part) => part.trim())

  if (parts.length < 3) return { regionName: '', districtName: '', addressLine: String(address ?? '').trim() }

  return { regionName: parts[0], districtName: parts[1], addressLine: parts.slice(2).join(', ') }
}

/**
 * A coordinate inside this country is two whole degrees and six decimals -
 * nine characters exactly, and the form keeps it as text so the dot survives
 * being typed. It leaves for the endpoint as a number.
 */
export const COORDINATE_PATTERN = /^\d{2}\.\d{6}$/

export const COORDINATE_LENGTH = 9

export const formatCoordinate = (raw: string) => {
  const cleaned = String(raw ?? '').replace(/[^\d.]/g, '')
  const [whole, ...rest] = cleaned.split('.')

  const head = whole.slice(0, 2)

  if (rest.length === 0) return cleaned.includes('.') ? `${head}.` : head

  return `${head}.${rest.join('').slice(0, 6)}`
}

/** Obyektning sanitariya muhofaza zonasi (m). */
export const TXYZ_PROTECTION_DISTANCES = ['50 metr', '100 metr', '300 metr', '500 metr', '1 000 metr'] as const
