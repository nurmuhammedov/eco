import type { UrlParamValue } from '@/shared/types'

/**
 * A URL value as text. The params hook parses digits and true/false back into
 * numbers and booleans, which most screens then want as text again.
 */
export const paramText = (value: UrlParamValue | undefined, fallback = ''): string =>
  value === undefined || value === '' ? fallback : String(value)

/**
 * A URL value kept to a known set, so a hand-edited address cannot select a tab
 * or type that does not exist; anything else falls back.
 */
export const paramOneOf = <T extends string>(
  value: UrlParamValue | undefined,
  allowed: readonly T[],
  fallback: T
): T => {
  const text = value === undefined ? '' : String(value)

  return (allowed as readonly string[]).includes(text) ? (text as T) : fallback
}

/** A URL value as a number, or the fallback when it is missing or not numeric. */
export const paramNumber = <F extends number | undefined>(
  value: UrlParamValue | undefined,
  fallback: F
): number | F => {
  const parsed = typeof value === 'number' ? value : Number(value)

  return value === undefined || value === '' || typeof value === 'boolean' || !Number.isFinite(parsed)
    ? fallback
    : parsed
}
