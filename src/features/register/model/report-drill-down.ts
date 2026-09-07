/**
 * The params a deregistration report puts on the registry URL. They describe one
 * cell of that report, so any tab the reader picks afterwards has to drop them -
 * otherwise the tab looks selected while the list still answers to the report.
 */
export const REPORT_KEYS = ['reportChangeBelongType', 'reportChangeStatus'] as const

/** What a sub-tab clears: its own page, plus the report it may have arrived from. */
export const RESET_KEYS = ['page', ...REPORT_KEYS] as const
