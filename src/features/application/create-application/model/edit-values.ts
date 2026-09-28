/**
 * An edit keeps the owner, yet the schemas still ask a citizen owner for a
 * birth date. Any date passes; the update endpoints do not read it.
 */
export const KEPT_OWNER_BIRTH_DATE = new Date(1900, 0, 1)

/** Old records hold Cyrillic in fields the forms now take in Latin only; those start empty */
export const latinOrEmpty = <T>(value: T) => (typeof value === 'string' && /[\u0400-\u04FF]/.test(value) ? '' : value)

/** On update an emptied field is left out rather than sent as a blank */
export const withoutBlanks = <T extends object>(values: T) =>
  Object.fromEntries(
    Object.entries(values).map(([key, value]) => [
      key,
      value === '' || value === null || value === '+998' ? undefined : value,
    ])
  ) as T
