export const DECREE_SIGNERS_KEYS = {
  all: ['decree-signers'] as const,
  list: (filters: any) => [...DECREE_SIGNERS_KEYS.all, 'list', filters] as const,
}
