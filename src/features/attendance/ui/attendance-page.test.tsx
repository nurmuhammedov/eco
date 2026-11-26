import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AttendancePage from './attendance-page'

const mocks = vi.hoisted(() => ({ canManage: false }))

vi.mock('../model/use-attendance', () => ({
  useAttendanceAccess: () => ({ canManage: mocks.canManage, isRegional: false }),
  useAttendanceDivisions: () => ({
    data: [{ code: '00', name: 'Markaziy boshqarma', office_id: null, region_id: null, employees: 3 }],
  }),
}))
vi.mock('./timesheet-tab', () => ({ TimesheetTab: () => <div>tabel</div> }))
vi.mock('./summary-tab', () => ({ SummaryTab: () => <div>yig‘ma</div> }))
vi.mock('./logs-table', () => ({ LogsTable: () => <div>loglar</div> }))
vi.mock('./confirm-tab', () => ({ ConfirmTab: () => <div>tasdiqlash</div> }))
vi.mock('./absences-tab', () => ({ AbsencesTab: () => <div>yo‘qliklar</div> }))
vi.mock('./staff-tab', () => ({ StaffTab: () => <div>xodimlar</div> }))
vi.mock('./holidays-tab', () => ({ HolidaysTab: () => <div>bayramlar</div> }))

const renderPage = (path = '/attendance') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <AttendancePage />
    </MemoryRouter>
  )

beforeEach(() => {
  mocks.canManage = false
})

describe('AttendancePage', () => {
  it('shows the reports to everyone and opens on the timesheet', () => {
    renderPage()

    expect(screen.getAllByRole('tab').map((tab) => tab.textContent)).toEqual([
      'Tabel',
      'Yig‘ma hisobot',
      'Kunlik kirish/chiqish',
    ])
    expect(screen.getByText('tabel')).toBeInTheDocument()
  })

  it('gives HR the tabs where it enters what the terminals cannot know', () => {
    mocks.canManage = true
    renderPage('/attendance?tab=holidays')

    expect(screen.getAllByRole('tab')).toHaveLength(7)
    expect(screen.getByText('bayramlar')).toBeInTheDocument()
  })

  it('does not open an HR tab for a reader who has the address', () => {
    renderPage('/attendance?tab=staff')

    expect(screen.queryByText('xodimlar')).not.toBeInTheDocument()
    expect(screen.getByText('tabel')).toBeInTheDocument()
  })
})
