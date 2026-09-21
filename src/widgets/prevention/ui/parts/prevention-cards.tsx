import { useData } from '@/shared/hooks'
import { MONTHS } from '@/shared/constants/months'
import clsx from 'clsx'

interface IProps {
  activeRiskLevel: string
  year?: any
  type?: any
  onTabChange: (level: string) => void
}

export const PreventionCards = ({ activeRiskLevel, onTabChange, year, type }: IProps) => {
  const { data: monthCount = {} } = useData<any>('/preventions/count/by-month', !!year && !!type, {
    year,
    type,
  })

  const data = MONTHS.map((month) => {
    const key = `${month.value.toLowerCase()}Count`

    return {
      id: month.value,
      name: month.label,
      year: year,
      count: monthCount?.[key] || '0',
      inactiveClass: 'bg-teal/10 border-teal/20 text-teal',
      activeClass: 'bg-teal border-[#015a67] text-white shadow-sm',
    }
  })

  return (
    <div className="scrollbar-hidden flex w-full gap-2 overflow-x-auto">
      {data.map((item) => {
        const isActive = activeRiskLevel === item.id

        return (
          <button
            key={item.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onTabChange(item.id)}
            className={clsx(
              'relative flex flex-1 cursor-pointer items-center justify-between rounded-lg border p-3 text-left transition-colors duration-200 select-none',
              isActive ? item.activeClass : `${item.inactiveClass} hover:opacity-80`
            )}
          >
            <div className="w-full">
              <div className="flex w-full justify-between gap-2">
                <p className="mb-1 text-sm font-medium opacity-90">{item.name}</p>
                <p className="mb-1 text-sm font-medium opacity-90">{item?.year}</p>
              </div>
              <h3 className={clsx('text-2xl font-bold')}>{item.count}</h3>
            </div>
          </button>
        )
      })}
    </div>
  )
}

export default PreventionCards
