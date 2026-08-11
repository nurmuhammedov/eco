import { useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Plus, Edit2, UserCheck } from 'lucide-react'
import { format } from 'date-fns'
import { DataTable } from '@/shared/components/common/data-table'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Department } from '../api/departments.api'
import { useGetDepartments, useDeleteDepartment } from '../model/use-departments'
import { DepartmentModal } from './department-modal'
import DeleteConfirmationDialog from '@/shared/components/common/delete-confirm-dialog'

export function DepartmentsList() {
  const { data, isLoading } = useGetDepartments()
  const deleteMutation = useDeleteDepartment()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDept, setSelectedDept] = useState<Department | null>(null)

  const handleAdd = () => {
    setSelectedDept(null)
    setIsModalOpen(true)
  }

  const handleEdit = (dept: Department) => {
    setSelectedDept(dept)
    setIsModalOpen(true)
  }

  const columns: ColumnDef<Department>[] = [
    {
      accessorKey: 'name',
      header: 'Bo‘lim nomi',
    },
    {
      accessorKey: 'responsible_name',
      header: 'Mas’ul xodim',
      cell: ({ row }) => {
        const name = row.original.responsible_name
        if (!name) {
          return <span className="text-muted-foreground text-sm italic">Belgilanmagan</span>
        }
        return (
          <div className="flex items-center gap-1.5">
            <UserCheck className="h-3.5 w-3.5 shrink-0 text-blue-500" />
            <span>{name}</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'is_active',
      header: 'Holati',
      cell: ({ row }) => {
        const isActive = row.original.is_active
        return (
          <Badge variant={isActive ? 'default' : 'destructive'} className={isActive ? 'bg-green-500' : ''}>
            {isActive ? 'Faol' : 'Faol emas'}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Yaratilgan sana',
      cell: ({ row }) => {
        return format(new Date(row.original.created_at), 'dd.MM.yyyy HH:mm')
      },
    },
    {
      id: 'actions',
      header: 'Amallar',
      cell: ({ row }) => {
        const dept = row.original
        return (
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleEdit(dept)} className="h-8 w-8 text-blue-500">
              <Edit2 className="h-4 w-4" />
            </Button>
            <DeleteConfirmationDialog
              variant="outline"
              onConfirm={() => deleteMutation.mutate(dept.id)}
              title="Bo‘limni o‘chirish"
              description={`Haqiqatan ham "${dept.name}" bo‘limini o‘chirmoqchimisiz?`}
            />
          </div>
        )
      },
    },
  ]

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden">
      <div className="mb-2 flex items-center justify-end">
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" /> Qo‘shish
        </Button>
      </div>

      <DataTable data={data || []} columns={columns} isLoading={isLoading} className="flex-1" />

      <DepartmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedDept(null)
        }}
        data={selectedDept}
      />
    </div>
  )
}
