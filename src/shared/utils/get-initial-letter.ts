export function getInitials(input: any, maxLength = 1, fallback = '?'): string {
  if (input === null || input === undefined) {
    return fallback
  }

  const str = String(input).trim()
  if (!str) {
    return fallback
  }

  try {
    const parts = str.split(/\s+/).filter(Boolean)
    if (!parts.length) {
      return str.charAt(0).toUpperCase() || fallback
    }
    const initials = parts
      .slice(0, maxLength)
      .map((part) => {
        const firstChar = Array.from(part)[0] || ''
        return firstChar.toUpperCase()
      })
      .join('')
    return initials || fallback
  } catch (error) {
    console.error(error)
    return fallback
  }
}
