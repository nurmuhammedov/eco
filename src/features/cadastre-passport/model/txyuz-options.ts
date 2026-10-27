/**
 * The wording comes from the Qisqartirmalar reference the committee issued for
 * the attributive form. Every one of these fields is plain text on the wire, so
 * the lists are a shortcut for the usual answers - anything else is typed in.
 */

/** Texnogen xavf yuqori bo‘lgan zona obyektining vazifasi. */
export const TXYUZ_PURPOSES = [
  'Avtomobillarga gaz to‘ldirish kompressor shoxobchasi (AGTKSH)',
  'Avtomobillarga gaz quyish shoxobchasi (AGQSH)',
  'Avtomobillarga yonilg‘i quyish shoxobchasi (AYQSH)',
  'Konteynerli avtomobillarga yonilg‘i quyish shoxobchasi (KAYQSH)',
  'Gaz to‘ldirish shoxobchasi (GTSH)',
  'Gaz to‘ldirish punkti (GTP)',
] as const

/** Ishlab chiqarish, qayta ishlash, saqlash va foydalanish moddasining nomi. */
export const TXYUZ_SUBSTANCES = [
  'Siqilgan tabiiy gaz (metan)',
  'Suyultirilgan uglevodorod gazi (propan)',
  'Avtobenzin yonilg‘isi',
  'Dizel yonilg‘isi',
] as const

/** Yong‘in o‘chirish vositasining turi. */
export const TXYUZ_FIREFIGHTING_EQUIPMENT = [
  'OP – 1',
  'OP – 2',
  'OP – 3',
  'OP – 5',
  'OP – 10',
  'OP – 50',
  'OP – 100',
] as const

/** Texnogen xavf rivojlanishida ustunlik qiluvchi turi. */
export const TXYUZ_DOMINANT_HAZARD_TYPES = [
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

/** Shown as the placeholder: the shape is easier to follow from an example than from a rule. */
export const LAND_CADASTRE_NUMBER_SAMPLE = '18:01:02:03:04:0123'

/** The land registry's certificate number: a two-letter series and six digits. */
export const CERTIFICATE_NUMBER_PATTERN = /^[A-Z]{2} \d{6}$/

export const CERTIFICATE_NUMBER_LENGTH = 9

export const CERTIFICATE_NUMBER_SAMPLE = 'QV 123456'

/** Letters first, then the space, then the digits - typed in any case. */
export const formatCertificateNumber = (raw: string) => {
  const cleaned = String(raw ?? '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')

  const letters = cleaned.slice(0, 2).replace(/[^A-Z]/g, '')

  if (letters.length < 2) return letters

  const digits = cleaned.slice(2).replace(/\D/g, '').slice(0, 6)

  return digits ? `${letters} ${digits}` : letters
}

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
 * A coordinate inside this country is two whole degrees and three to six
 * decimals, and the form keeps it as text so the dot survives being typed. It
 * leaves for the endpoint as a number.
 */
export const COORDINATE_PATTERN = /^\d{2}\.\d{3,6}$/

export const COORDINATE_LENGTH = 9

/** The reference sheet's own example, so X and Y cannot be read the wrong way round. */
export const LONGITUDE_SAMPLE = '60.123456'
export const LATITUDE_SAMPLE = '40.123456'

export const formatCoordinate = (raw: string) => {
  const cleaned = String(raw ?? '').replace(/[^\d.]/g, '')
  const [whole, ...rest] = cleaned.split('.')

  const head = whole.slice(0, 2)

  if (rest.length === 0) return cleaned.includes('.') ? `${head}.` : head

  return `${head}.${rest.join('').slice(0, 6)}`
}

/** Map links for a typed pair, so the customer can check where it lands. */
export const mapLinks = (latitude: string, longitude: string) => {
  if (!COORDINATE_PATTERN.test(latitude) || !COORDINATE_PATTERN.test(longitude)) return null

  return {
    google: `https://www.google.com/maps?q=${latitude},${longitude}`,
    yandex: `https://yandex.uz/maps/?pt=${longitude},${latitude}&z=16&l=map`,
  }
}

/**
 * Obyektning idoraviy mansubligi is "<name> <body>" - the name typed by hand,
 * the kind of body picked from this list, e.g. "Andijon shahar hokimligi".
 */
export const BELONGING_TYPES = ['tumani hokimligi', 'shahar hokimligi'] as const

/** Saved before the wording was fixed; read back as its current form. */
const LEGACY_BELONGING_TYPES: Record<string, (typeof BELONGING_TYPES)[number]> = {
  'tuman hokimligi': 'tumani hokimligi',
}

/** The longest type that ends the string wins, so "shahar hokimligi" is not read as "...hokimligi". */
export const splitBelonging = (value?: string | null) => {
  const full = String(value ?? '').trim()
  const known = [...BELONGING_TYPES, ...Object.keys(LEGACY_BELONGING_TYPES)]
  const type = known.sort((a, b) => b.length - a.length).find((item) => full === item || full.endsWith(` ${item}`))

  if (!type) return { belongingName: full, belongingType: '' }

  return {
    belongingName: full.slice(0, full.length - type.length).trim(),
    belongingType: LEGACY_BELONGING_TYPES[type] ?? type,
  }
}

/** Texnogen xavf yuqori bo‘lgan zona obyektining xavflilik darajasi; any other text typed is kept as typed. */
export const TXYUZ_HAZARD_LEVELS = ['I – tip', 'II – tip', 'III – tip'] as const

/** Inson salomatligi uchun salbiy ta'sir ko'rsatuvchi omillar; any other text typed is kept as typed. */
export const TXYUZ_HEALTH_RISK_FACTORS = [
  'Havodan zaharlanish, ko‘z achishishi, tana kuyishi va jarohatlanish',
] as const

/** Obyektning sanitariya muhofaza zonasi (m). */
export const TXYUZ_PROTECTION_DISTANCES = ['50', '100', '300', '500', '1 000'] as const

/**
 * The state registry certificate and the licence are issued as a two-letter
 * series and six digits, the same shape the land registry uses.
 */
export const STATE_REGISTRY_CERT_NUMBER_SAMPLE = 'QSH 12345'

export const LICENSE_NUMBER_SAMPLE = 'AB 001234'

/** KTUT (OKPO) - eight digits. */
export const OKPO_PATTERN = /^\d{8}$/
export const OKPO_LENGTH = 8

/** YBK (MFO) - five digits. */
export const BANK_MFO_PATTERN = /^\d{5}$/
export const BANK_MFO_LENGTH = 5

export const onlyDigits = (raw: string, max: number) =>
  String(raw ?? '')
    .replace(/\D/g, '')
    .slice(0, max)
