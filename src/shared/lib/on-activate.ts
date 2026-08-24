import { KeyboardEvent } from 'react'

/**
 * Keyboard activation for an element that cannot be a real `<button>` - because
 * it already contains one, or because turning it into one would break the
 * layout it relies on.
 *
 * A native button fires its click on Enter and Space; anything carrying only an
 * onClick handler is unreachable without a pointer, so it has to say so itself.
 * Pair this with `role="button"` and `tabIndex={0}`, which give the element a
 * name, a focus stop and the announced role.
 */
export const onActivate =
  (handler: () => void) =>
  (event: KeyboardEvent): void => {
    if (event.key !== 'Enter' && event.key !== ' ') return

    event.preventDefault()
    handler()
  }
