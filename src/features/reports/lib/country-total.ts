const COUNTRY_TOTAL = /^(respublika|respublika bo['‘’ʻʼ]yicha|o['‘’ʻʼ]zbekiston respublikasi)$/i

/**
 * The country-wide row the region reports come with. The backend labels it in
 * prose (`Respublika bo'yicha`, with a plain apostrophe) instead of flagging it.
 */
export const isCountryTotal = (name?: string | null) => !!name && COUNTRY_TOTAL.test(name.trim())
