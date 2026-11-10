import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { ColumnFilterInput } from './column-filter-input'
import type { ExtendedColumnDef } from './model/column-def'

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }))

// Two columns feeding the one backend `search`, as on the appeals and registrations lists
const numberColumn: ExtendedColumnDef<unknown> = {
  id: 'number',
  filterKey: 'number',
  filterClearKeys: ['ownerIdentity'],
}
const identityColumn: ExtendedColumnDef<unknown> = {
  id: 'ownerIdentity',
  filterKey: 'ownerIdentity',
  filterClearKeys: ['number'],
  filterType: 'number',
}
const nameColumn: ExtendedColumnDef<unknown> = { id: 'ownerName', filterKey: 'ownerName' }

const Location = () => <output data-testid="location">{useLocation().search}</output>

const renderFilters = (url: string, columns: ExtendedColumnDef<unknown>[]) =>
  render(
    <MemoryRouter initialEntries={[url]}>
      {columns.map((column) => (
        <ColumnFilterInput key={column.id} column={column} />
      ))}
      <Location />
    </MemoryRouter>
  )

const params = () => new URLSearchParams(screen.getByTestId('location').textContent ?? '')

const typeInto = (index: number, value: string) => {
  fireEvent.change(screen.getAllByRole('textbox')[index], { target: { value } })
  // A filter writes to the URL once typing settles
  act(() => vi.advanceTimersByTime(800))
}

describe('ColumnFilterInput', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  // A STIR typed under STIR/JSHSHIR showed up under the registration number too (2026-11-10)
  it('keeps a value in its own filter and clears the one it shares a parameter with', () => {
    renderFilters('/registrations?number=47360-QUR-NR-2026', [numberColumn, identityColumn])

    typeInto(1, '304305803')

    expect(params().get('ownerIdentity')).toBe('304305803')
    expect(params().has('number')).toBe(false)

    const [numberInput, identityInput] = screen.getAllByRole('textbox')
    expect(numberInput).toHaveValue('')
    expect(identityInput).toHaveValue('304305803')
  })

  it('leaves the other filters alone when it has nothing to clear', () => {
    renderFilters('/registrations?number=47360-QUR-NR-2026', [numberColumn, nameColumn])

    typeInto(1, 'RAVON')

    expect(params().get('ownerName')).toBe('RAVON')
    expect(params().get('number')).toBe('47360-QUR-NR-2026')
  })
})
