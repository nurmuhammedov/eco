import { DataTable } from '@/shared/components/common/data-table'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import React from 'react'

const baseData = [
  {
    id: 1,
    buyurtmachi: 'YUKSAK GʻOYA QURILISH MCHJ',
    stir: '303309101',
    sertifikat_raqami: 'UZ.SMT-01-0068-143502',
    ishlab_chiqaruvchi: 'SPACE-S MCHJ, Uzbekistan',
    model: 'SPS 630',
    seriya_raqami: 'SPS-10230630-748M',
    viloyat: 'Toshkent v.',
    tuman: 'Zangiota t.',
    mahalla: 'Doʻng qishloq',
    kucha: 'Doʻng',
    uy: 'J-15',
    lift_turi: 'Yoʻlovchi tashuvchi',
    uy_qavati: '5',
    created_at: '28.03.2026 18:15:00',
    kadastr_number: '17:01:41:02:01:0174',
    texnik_korik_holat: 'Oʻtkazilgan',
    texnik_korik_sana: '28.03.2026',
    keyingi_korik_sana: '28.03.2026',
  },
  {
    id: 2,
    buyurtmachi: 'KHOREZM STAR HOUSE MCHJ',
    stir: '308425896',
    sertifikat_raqami: 'UZ.SMT-01-0068-182470',
    ishlab_chiqaruvchi: 'At-ally co., Ltd, Xitoy',
    model: 'MRL-TKJV',
    seriya_raqami: 'K2510326',
    viloyat: 'Xorazm v.',
    tuman: 'Urganch sh.',
    mahalla: 'Arboblar',
    kucha: 'Mirzo Ulugʻbek',
    uy: '24/2',
    lift_turi: 'Yoʻlovchi tashuvchi',
    uy_qavati: '8',
    created_at: '28.03.2026',
    kadastr_number: '22:03:41:02:02:2832/0001',
    texnik_korik_holat: 'Oʻtkazilgan',
    texnik_korik_sana: '28.03.2026',
    keyingi_korik_sana: '28.03.2026',
  },
]

const mockData = Array.from({ length: 50 }, (_, i) => ({
  ...baseData[i % baseData.length],
  id: i + 1,
}))

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
      header: 'Keyingi koʻrik sanasi',
      accessorKey: 'keyingi_korik_sana',
    },
  ]

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <DataTable data={mockData} columns={columns} isLoading={false} className="flex-1" />
    </div>
  )
}

export default React.memo(ElevatorsWidget)
