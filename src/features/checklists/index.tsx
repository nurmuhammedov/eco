import { useCheckListSelect } from '@/features/checklists/hooks/use-checklist-select.ts'
import FileLink from '@/shared/components/common/file-link.tsx'

const Checklists = () => {
  const { data } = useCheckListSelect()
  if (!data) return null
  return (
    <div>
      <h5 className="mb-4 text-2xl font-semibold uppercase">Cheklistlar</h5>
      <div className="grid grid-cols-2 gap-x-8 rounded-lg bg-white p-4 shadow">
        {data?.map((item: any) => {
          return (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 border-b border-b-[#E5E7EB] px-3 py-4"
            >
              <p>{item.name}</p>
              <p className="shrink-0">
                <FileLink url={item.path} />
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Checklists
