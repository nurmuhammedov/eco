import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TruncatedCell } from './truncated-cell'

const LONG = 'Murojaat matni '.repeat(20)

describe('TruncatedCell', () => {
  it('leaves a short value alone, with nothing to open', () => {
    render(<TruncatedCell value="Qisqa matn" expandable />)

    expect(screen.getByText('Qisqa matn')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('says the value is missing rather than printing an empty cell', () => {
    render(<TruncatedCell value={null} />)

    expect(screen.getByText('Mavjud emas')).toBeInTheDocument()
  })

  it('opens the whole text on click when expandable', async () => {
    const user = userEvent.setup()
    render(<TruncatedCell value={LONG} expandable />)

    const trigger = screen.getByRole('button')
    expect(trigger).toHaveTextContent('Murojaat matni')

    await user.click(trigger)

    // The popover repeats the text, so the opened copy is the second one.
    const shown = await screen.findAllByText(LONG.trim(), { exact: false })
    expect(shown.length).toBeGreaterThan(1)
  })

  it('does not turn a long value into a button unless asked', () => {
    render(<TruncatedCell value={LONG} />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
