/**
 * The text of anything that was thrown: an Error, the API clients' `{ message }`
 * object, or a bare string. Anything else yields the fallback.
 */
export const getErrorMessage = (error: unknown, fallback = ''): string => {
  if (typeof error === 'string') return error || fallback

  if (typeof error === 'object' && error !== null && 'message' in error) {
    const { message } = error as { message: unknown }

    if (typeof message === 'string' && message) return message
  }

  return fallback
}
