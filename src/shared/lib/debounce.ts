export function debounce<A extends unknown[]>(func: (...args: A) => unknown, wait: number): (...args: A) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return function debouncedFn(this: unknown, ...args: A) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this

    const later = () => {
      timeout = null
      func.apply(context, args)
    }

    if (timeout !== null) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(later, wait)
  }
}
