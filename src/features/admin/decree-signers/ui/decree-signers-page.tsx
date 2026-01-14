import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { Button } from '@/shared/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { DataTable } from '@/shared/components/common/data-table/data-table'
import { useCustomSearchParams } from '@/shared/hooks'
import { ColumnDef } from '@tanstack/react-table'
import { DecreeSigner } from '@/entities/admin/decree-signers/model/types'
import { useDecreeSigners } from '@/entities/admin/decree-signers/api/queries'
import { useDeleteDecreeSigner } from '@/entities/admin/decree-signers/api/mutations'
import { AddDecreeSignerModal } from './add-decree-signer-modal'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog'

const DecreeSignersPage = () => {
  const [activeTab, setActiveTab] = useState('IRS_XRAY')
  const [modalOpen, setModalOpen] = useState(false)

  const { paramsObject } = useCustomSearchParams()
  const { page = 1, size = 10 } = paramsObject

  const { data: signersData, isLoading } = useDecreeSigners({
    belongType: activeTab,
    page: Number(page),
    size: Number(size),
  })

  // Delete logic
  const { mutate: deleteSigner } = useDeleteDecreeSigner()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const columns: ColumnDef<DecreeSigner>[] = [
    {
      accessorKey: 'belongType',
      header: 'Yo‘nalish',
      cell: ({ row }) => {
        const type = row.original.belongType
        return type === 'IRS_XRAY' ? 'INM va Rentgen' : 'Boshqalar'
      },
    },
    {
      accessorKey: 'position',
      header: 'Lavozim',
      cell: ({ row }) => row.original.position || '-',
    },
    {
      accessorKey: 'fullName',
      header: 'F.I.SH.',
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:bg-red-50 hover:text-red-600"
              onClick={() => setDeleteId(row.original.id)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="flex h-full flex-col space-y-4 overflow-hidden">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Imzolovchi shaxslar</h1>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="mr-2 size-4" />
          Qo'shish
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex w-full flex-1 flex-col">
        <TabsList className="w-max">
          <TabsTrigger value="IRS_XRAY">INM va Rentgen</TabsTrigger>
          <TabsTrigger value="OTHER">Boshqalar</TabsTrigger>
        </TabsList>
        <TabsContent value="IRS_XRAY" className="mt-4 flex flex-1 flex-col overflow-hidden">
          {/* DataTable expects data array directly if no pagination object structure is enforced by wrapper, 
               but here we assume standard data table usage */}
          <DataTable columns={columns} data={signersData || []} isLoading={isLoading} />
        </TabsContent>
        <TabsContent value="OTHER" className="mt-4 flex flex-1 flex-col overflow-hidden">
          <DataTable columns={columns} data={signersData || []} isLoading={isLoading} />
        </TabsContent>
      </Tabs>

      <AddDecreeSignerModal open={modalOpen} onOpenChange={setModalOpen} />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>O'chirishni tasdiqlaysizmi?</AlertDialogTitle>
            <AlertDialogDescription>Bu amalni ortga qaytarib bo'lmaydi.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => {
                if (deleteId) deleteSigner(deleteId)
                setDeleteId(null)
              }}
            >
              O'chirish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default DecreeSignersPage
