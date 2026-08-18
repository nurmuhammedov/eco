import { DataTable } from '@/shared/components/common/data-table'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import React from 'react'

const elevators: any[] = []

const ElevatorsWidget = () => {
  const columns: ExtendedColumnDef<any, any>[] = [
    {
      header: 'Buyurtmachi',
      accessorKey: 'buyurtmachi',
    },
    {
      header: 'STIR',
      accessorKey: 'stir',
    },
    {
      header: 'Sertifikat raqami',
      accessorKey: 'sertifikat_raqami',
    },
    {
      header: 'Ishlab chiqaruvchi',
      accessorKey: 'ishlab_chiqaruvchi',
    },
    {
      header: 'Model',
      accessorKey: 'model',
    },
    {
      header: 'Seriya raqami',
      accessorKey: 'seriya_raqami',
    },
    {
      header: 'Manzil',
      id: 'address',
      cell: ({ row }) => {
        const { viloyat, tuman, mahalla, kucha, uy } = row.original
        return `${viloyat}, ${tuman}, ${mahalla}, ${kucha}, ${uy}`
      },
    },
    {
      header: 'Lift turi',
      accessorKey: 'lift_turi',
    },
    {
      header: 'Qavatlar soni',
      accessorKey: 'uy_qavati',
    },
    {
      header: 'Kadastr raqami',
      accessorKey: 'kadastr_number',
    },
    {
      header: 'Texnik koʻrik sanasi',
      accessorKey: 'texnik_korik_sana',
    },
    {
      header: 'Keyingi texnik koʻrik sanasi',
      accessorKey: 'keyingi_korik_sana',
    },
  ]

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <DataTable data={elevators} columns={columns} isLoading={false} className="flex-1" />
    </div>
  )
}

export default React.memo(ElevatorsWidget)
