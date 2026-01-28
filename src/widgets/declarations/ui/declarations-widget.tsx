import { DeclarationsTable } from '@/features/declarations/ui/declarations-table'
import { Button } from '@/shared/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { UserRoles } from '@/entities/user'
import { useAuth } from '@/shared/hooks/use-auth'

const DeclarationsWidget = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleAdd = () => {
    navigate('/declarations/add')
  }

  // Legal user can add without conditions (as requested: "Legal rolda hech qanday shartlariz korinadi")
  const canAdd = user?.role === UserRoles.LEGAL

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden">
      {canAdd && (
        <div className="flex items-center justify-end gap-4">
          <Button onClick={handleAdd}>
            <PlusCircle className="mr-2 h-4 w-4" /> Qo‘shish
          </Button>
        </div>
      )}

      <div className="flex flex-1 flex-col gap-2 overflow-hidden">
        <DeclarationsTable />
      </div>
    </div>
  )
}

export default DeclarationsWidget
