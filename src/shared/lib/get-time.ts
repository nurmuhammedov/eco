type TimeUnit = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month'

export const getTime = <T extends TimeUnit>(value: number, unit: T): number => {
  switch (unit) {
    case 'second':
      return value * 1000
    case 'minute':
      return value * 60 * 1000
    case 'hour':
      return value * 60 * 60 * 1000
    case 'day':
      return value * 24 * 60 * 60 * 1000
    case 'week':
      return value * 7 * 24 * 60 * 60 * 1000
    case 'month':
      return value * 30 * 24 * 60 * 60 * 1000
    default:
      return value
  }
}
