/** Shared by the documents table and the signers modal it opens. */
export const signStatuses = new Map([
  [true, { label: 'Imzolangan', variant: 'info' }],
  [false, { label: 'Imzolanmagan', variant: 'warning' }],
] as const)
