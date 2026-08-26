/**
 * Added to the hazardous facility registration application. The wording is the
 * backend's own, which is what the regulation quotes - shortening it here would
 * leave the form and the registry saying different things.
 */
export enum HfHazardousSign {
  HAZARDOUS_MATERIALS = 'HAZARDOUS_MATERIALS',
  PRESSURE_EQUIPMENT = 'PRESSURE_EQUIPMENT',
  LIFTING_EQUIPMENT = 'LIFTING_EQUIPMENT',
  METAL_MELTING = 'METAL_MELTING',
  MINING_OPERATIONS = 'MINING_OPERATIONS',
}

export const HF_HAZARDOUS_SIGN_LABELS: Record<string, string> = {
  [HfHazardousSign.HAZARDOUS_MATERIALS]:
    'Xavfli moddalardan foydalanish, ularni ishlab chiqarish, qayta ishlash, hosil qilish, saqlash, tashish, yo‘q qilish',
  [HfHazardousSign.PRESSURE_EQUIPMENT]:
    '0,05 megapaskaldan ortiq bosim ostida yoki suyuqlikning qaynash haroratidan ortiq haroratda ishlaydigan uskunalardan foydalanish',
  [HfHazardousSign.LIFTING_EQUIPMENT]:
    'Ko‘chmas asosga o‘rnatilgan yuk ko‘tarish mexanizmlari, eskalatorlar, osma yo‘llar, funikulyorlardan foydalanish',
  [HfHazardousSign.METAL_MELTING]: 'Qora va rangli metallar eritmalari hamda ushbu eritmalar asosida qotishmalar olish',
  [HfHazardousSign.MINING_OPERATIONS]:
    'Konchilik ishlari, foydali qazilmalarni qazib olish va boyitish ishlari, shuningdek yer osti sharoitida ish olib borish',
}

export enum HfLegalType {
  OWNED = 'OWNED',
  TENANT = 'TENANT',
  OTHER = 'OTHER',
}

export const HF_LEGAL_TYPE_LABELS: Record<string, string> = {
  [HfLegalType.OWNED]: 'Mulkdor',
  [HfLegalType.TENANT]: 'Ijarachi',
  [HfLegalType.OTHER]: 'Boshqa',
}

const toOptions = (labels: Record<string, string>) => Object.entries(labels).map(([id, name]) => ({ id, name }))

export const HF_HAZARDOUS_SIGN_OPTIONS = toOptions(HF_HAZARDOUS_SIGN_LABELS)

export const HF_LEGAL_TYPE_OPTIONS = toOptions(HF_LEGAL_TYPE_LABELS)
