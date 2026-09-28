import type { DecreeSignersParams } from '../model/types'

export const DECREE_SIGNERS_KEYS = {
  all: ['decree-signers'] as const,
  list: (filters: DecreeSignersParams) => [...DECREE_SIGNERS_KEYS.all, 'list', filters] as const,
}
