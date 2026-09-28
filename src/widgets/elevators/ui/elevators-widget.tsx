import { DataTable } from '@/shared/components/common/data-table'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import React from 'react'

/** An elevator as the external register lists it; the page has no data source yet */
interface ElevatorRow {
  buyurtmachi: string
  stir: string
  sertifikat_raqami: string
  ishlab_chiqaruvchi: string
  model: string
  seriya_raqami: string
  viloyat: string
  tuman: string
  mahalla: string
  kucha: string
  uy: string
  lift_turi: string
  uy_qavati: number
  kadastr_number: string
  texnik_korik_sana: string
  keyingi_korik_sana: string
}

const elevators: ElevatorRow[] = []

const ElevatorsWidget = () => {
  const columns: ExtendedColumnDef<ElevatorRow, unknown>[] = [
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
      header: 'Texnik ko‘rik sanasi',
      accessorKey: 'texnik_korik_sana',
    },
    {
      header: 'Keyingi texnik ko‘rik sanasi',
      accessorKey: 'keyingi_korik_sana',
    },
  ]

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <DataTable isPaginated data={elevators} columns={columns} isLoading={false} className="flex-1" />
    </div>
  )
}

export default React.memo(ElevatorsWidget)
