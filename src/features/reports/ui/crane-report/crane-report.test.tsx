import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { format } from 'date-fns'
import type { CraneReportRow } from './types'
import CraneReport from './index'

const useDataMock = vi.fn()

vi.mock('@/shared/hooks', () => ({
  useData: (...args: unknown[]) => useDataMock(...args),
}))

const types = (autocrane: number, tower: number) => [
  {
    childEquipmentId: 1,
    name: 'Avtokran',
    totalCount: autocrane,
    withPermitCount: 233,
    withoutPermitCount: autocrane - 233,
    registeredCount: 15,
    permitAddedCount: 20,
    permitChangedCount: 10,
  },
  {
    childEquipmentId: 2,
    name: 'Minorali kran',
    totalCount: tower,
    withPermitCount: 476,
    withoutPermitCount: tower - 476,
    registeredCount: 7,
    permitAddedCount: 9,
    permitChangedCount: 18,
  },
]

const DATA: CraneReportRow[] = [
  { regionId: null, regionName: "Respublika bo'yicha", totalCount: 8769, types: types(4244, 1734) },
  { regionId: 5, regionName: 'Jizzax viloyati', totalCount: 512, types: types(300, 500) },
]

const renderReport = () =>
  render(
    <MemoryRouter initialEntries={['/reports/crane']}>
      <CraneReport />
    </MemoryRouter>
  )

describe('CraneReport', () => {
  it('asks for today’s work until a period is picked', () => {
    useDataMock.mockReturnValue({ data: DATA, isLoading: false, isError: false })
    renderReport()

    const today = format(new Date(), 'yyyy-MM-dd')
    expect(useDataMock).toHaveBeenCalledWith('/reports/registry/crane', true, { startDate: today, endDate: today })
  })

  it('builds a three-row header with one six-column group per crane type the backend sends', () => {
    useDataMock.mockReturnValue({ data: DATA, isLoading: false, isError: false })
    renderReport()

    const head = screen.getAllByRole('rowgroup')[0]
    expect(within(head).getAllByRole('row')).toHaveLength(3)

    expect(within(head).getByText('Hududlar')).toHaveAttribute('rowspan', '3')
    expect(within(head).getByText('Barcha turdagi umumiy kranlar soni')).toHaveAttribute('rowspan', '3')
    expect(within(head).getByText('Avtokran')).toHaveAttribute('colspan', '6')
    expect(within(head).getByText('Minorali kran')).toHaveAttribute('colspan', '6')

    const current = within(head).getAllByText('Hozirgi kun holati')
    const done = within(head).getAllByText('Bajarilgan ishlar')
    expect(current).toHaveLength(2)
    expect(done).toHaveLength(2)
    current.concat(done).forEach((cell) => expect(cell).toHaveAttribute('colspan', '3'))

    expect(within(head).getAllByText('Ruxsatnomasi yo‘qlar')).toHaveLength(2)
  })

  it('heads the body with the country total in bold and groups thousands', () => {
    useDataMock.mockReturnValue({ data: DATA, isLoading: false, isError: false })
    renderReport()

    const [, body] = screen.getAllByRole('rowgroup')
    const [total, region] = within(body).getAllByRole('row')

    expect(total).toHaveClass('font-bold')
    expect(within(total).getAllByRole('cell')[0]).toHaveTextContent('Respublika bo‘yicha')
    expect(within(total).getAllByRole('cell')[1].textContent).toBe('8\u00a0769')
    expect(within(total).getAllByRole('cell')[2].textContent).toBe('4\u00a0244')

    expect(region).not.toHaveClass('font-bold')
    // 2 fixed columns + 2 types × 6
    expect(within(region).getAllByRole('cell')).toHaveLength(14)
  })

  it('shows the backend’s message when the period is rejected', () => {
    useDataMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: { message: 'Boshlanish sanasi tugash sanasidan keyin bo‘lishi mumkin emas' },
    })
    renderReport()

    expect(screen.getByText('Boshlanish sanasi tugash sanasidan keyin bo‘lishi mumkin emas')).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })
})
