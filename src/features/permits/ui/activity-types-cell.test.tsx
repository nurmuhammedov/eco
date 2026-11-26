import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ActivityTypesCell } from './activity-types-cell'

const LONG = 'Gaz xo‘jaligida yuqori, o‘rta va past bosimli po‘lat yer osti gaz quvurlarini montaj qilish, ta’mirlash'

describe('ActivityTypesCell', () => {
  it('shows a dash when there are none', () => {
    render(<ActivityTypesCell names={[]} />)
    expect(screen.getByText('—')).toBeInTheDocument()

    render(<ActivityTypesCell names={null} />)
    expect(screen.getAllByText('—')).toHaveLength(2)
  })

  it('shows a single type as it is, trimmed, with the full text in its tooltip', () => {
    render(<ActivityTypesCell names={[`${LONG}  `]} />)

    expect(screen.getByText(LONG)).toHaveAttribute('title', LONG)
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  it('puts several on numbered lines of their own instead of joining names that hold commas', () => {
    render(<ActivityTypesCell names={[LONG, ' Attraksionlardan foydalanish ']} />)

    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(2)
    expect(items[0]).toHaveTextContent(`1. ${LONG}`)
    expect(items[1]).toHaveTextContent('2. Attraksionlardan foydalanish')
    expect(items[1]).toHaveAttribute('title', 'Attraksionlardan foydalanish')
  })
})
