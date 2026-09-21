/**
 * Risk indicators live under one endpoint per object type, and the type only
 * becomes known from the address bar. Written here once so the queries and the
 * mutations that stale them cannot spell it differently.
 */
export const riskIndicatorsEndpoint = (type?: string | null) => `/${String(type ?? '').toLowerCase()}-risk-indicators`
