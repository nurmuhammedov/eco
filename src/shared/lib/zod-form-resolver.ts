import { zodResolver } from '@hookform/resolvers/zod'
import type { FieldValues, Resolver } from 'react-hook-form'
import type { z } from 'zod'

/**
 * zodResolver for a form that holds what the fields edit and submits what the
 * schema turns it into (a date picked as a Date, sent as a string). The
 * installed resolver types only one side, so the pair is named here instead.
 */
export const zodFormResolver = <TInput extends FieldValues, TOutput>(schema: z.ZodTypeAny) =>
  zodResolver(schema) as unknown as Resolver<TInput, unknown, TOutput>

/** What a form holds while it is being filled: the schema's input, none of it there yet */
export type FormDraft<S extends z.ZodTypeAny> = Partial<z.input<S>>
