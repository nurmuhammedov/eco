import { useParams, useNavigate } from 'react-router-dom'
import { CategoryTypeView } from '@/features/admin/inspection/category-types/ui/category-type-view'
import { useCategoryTypeQuery } from '@/entities/admin/inspection/category-types/hooks/use-category-type-query'
import { Button } from '@/shared/components/ui/button'
import { Plus, ArrowLeft } from 'lucide-react'
import { useChecklistDrawer } from '@/shared/hooks/entity-hooks'
import { UIModeEnum } from '@/shared/types'
import { useData } from '@/shared/hooks/api'
import { Checklist } from '@/entities/admin/inspection'
import { ChecklistDrawer } from '@/features/admin/inspection/cheklists/ui/checklist-drawer'

export default function CategoryTypeViewPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: categoryType, isLoading } = useCategoryTypeQuery(Number(id))
  const { onOpen, isOpen } = useChecklistDrawer()

  const { data: checklistsData, isLoading: isChecklistsLoading } = useData<Checklist[]>(
    `/checklists/by-category/${id}`,
    !!id
  )

  const maxOrderNumber = checklistsData?.length ? Math.max(...checklistsData.map((c) => Number(c.orderNumber) || 0)) : 0

  const handleAddChecklist = () => {
    onOpen(UIModeEnum.CREATE, {
      categoryTypeId: categoryType?.id,
      category: categoryType?.type,
      orderNumber: (maxOrderNumber + 1).toString(),
    })
  }

  if (isLoading) return <div>Yuklanmoqda...</div>

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold">Tekshiruv turi tafsilotlari</h1>
        </div>
        <Button onClick={handleAddChecklist}>
          <Plus className="mr-2 h-4 w-4" />
          Yangi cheklist qo'shish
        </Button>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <CategoryTypeView
          data={categoryType || null}
          checklistsData={checklistsData || []}
          isChecklistsLoading={isChecklistsLoading}
        />
      </div>

      {isOpen && <ChecklistDrawer />}
    </div>
  )
}
