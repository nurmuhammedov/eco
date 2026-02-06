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
  const [modalOpen, setModalOpen] = useState(false)
  const { paramsObject, addParams } = useCustomSearchParams()
  const { page = 1, size = 10, tab = 'IRS_XRAY' } = paramsObject

  // Hozirda backend declaration uchun alohida tipga ega emas, shuning uchun OTHER ishlatiladi
  // Ammo kelajakda API o‘zgarsa, bu yerni to‘g'irlash oson bo‘ladi
  const queryBelongType: any = tab === 'DECLARATION' ? 'OTHER' : tab

  const { data: signersData, isLoading } = useDecreeSigners({
    belongType: queryBelongType,
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
        if (type === 'IRS_XRAY') return 'INM va Rentgen'
        if (type === 'OTHER') return 'XICHO va Boshqa'
        return type
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
          Qo‘shish
        </Button>
      </div>

      <Tabs
        value={tab as string}
        onValueChange={(val) => addParams({ tab: val })}
        className="flex w-full flex-1 flex-col"
      >
        <TabsList className="w-max">
          <TabsTrigger value="IRS_XRAY">INM va Rentgen tekshiruvlar</TabsTrigger>
          <TabsTrigger value="OTHER">XICHO va Boshqa tekshiruvlar</TabsTrigger>
          <TabsTrigger value="DECLARATION">Deklaratsiya tasdiqlash</TabsTrigger>
        </TabsList>
        <TabsContent value="IRS_XRAY" className="mt-4 flex flex-1 flex-col overflow-hidden">
          <DataTable columns={columns} data={signersData || []} isLoading={isLoading} />
        </TabsContent>
        <TabsContent value="OTHER" className="mt-4 flex flex-1 flex-col overflow-hidden">
          <DataTable columns={columns} data={signersData || []} isLoading={isLoading} />
        </TabsContent>
        <TabsContent value="DECLARATION" className="mt-4 flex flex-1 flex-col overflow-hidden">
          <DataTable columns={columns} data={signersData || []} isLoading={isLoading} />
        </TabsContent>
      </Tabs>

      <AddDecreeSignerModal open={modalOpen} onOpenChange={setModalOpen} />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>O‘chirishni tasdiqlaysizmi?</AlertDialogTitle>
            <AlertDialogDescription>Bu amalni ortga qaytarib bo‘lmaydi.</AlertDialogDescription>
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
              O‘chirish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default DecreeSignersPage
