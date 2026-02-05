import { Card } from '@/shared/components/ui/card'

interface DashboardStatsProps {
  type: 'hf' | 'equipment' | 'irs'
  data: any
}

export const DashboardStats = ({ type, data }: DashboardStatsProps) => {
  if (type === 'hf') {
    return (
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="flex flex-row items-center justify-between space-x-4 border-none bg-white p-4 shadow-sm">
          <div className="text-sm font-medium text-gray-500">Barchasi</div>
          <div className="text-2xl font-bold text-gray-900">{data.total}</div>
        </Card>
        <Card className="bg-primary text-primary-foreground flex flex-row items-center justify-between space-x-4 border-none p-4 shadow-sm">
          <div className="text-sm font-medium opacity-90">Amaldagi XICHOlar</div>
          <div className="rounded bg-white/20 px-2 py-0.5 text-xl font-bold">{data.active}</div>
        </Card>
        <Card className="flex flex-row items-center justify-between space-x-4 border-none bg-white p-4 shadow-sm">
          <div className="text-sm font-medium text-gray-500">Reyestrdan chiqarilgan XICHOlar</div>
          <div className="text-2xl font-bold text-gray-900">{data.inactive}</div>
        </Card>
      </div>
    )
  }

  if (type === 'equipment') {
    return (
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-5">
        <Card className="flex flex-row items-center justify-between border-none bg-white p-4 shadow-sm">
          <div className="text-sm font-medium text-gray-500">Barchasi</div>
          {/* No total number shown in the screenshot for "Barchasi" in equipment, but consistent to show it or keep simple label if needed. Assuming showing total based on logic */}
        </Card>
        <Card className="bg-primary text-primary-foreground col-span-2 flex flex-row items-center justify-between border-none p-4 shadow-sm">
          <div className="text-sm font-medium opacity-90">Reyestrdagi qurilmalar</div>
          <div className="rounded bg-white/20 px-2 py-0.5 text-xl font-bold">{data.active}</div>
        </Card>
        <Card className="flex flex-row items-center justify-between border-none bg-white p-4 shadow-sm">
          <div className="text-sm font-medium text-gray-500">Reyestrdan chiqarilgan</div>
          <div className="text-xl font-bold text-gray-900">{data.inactive}</div>
        </Card>
        <Card className="flex flex-row items-center justify-between border-none bg-white p-4 shadow-sm">
          <div className="text-sm font-medium text-gray-500">Muddati o‘tgan</div>
          <div className="text-xl font-bold text-gray-900">{data.expired}</div>
        </Card>
      </div>
    )
  }

  if (type === 'irs') {
    return (
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="bg-primary text-primary-foreground flex flex-row items-center justify-between space-x-4 border-none p-4 shadow-sm">
          <div className="text-sm font-medium opacity-90">Barchasi</div>
          <div className="rounded bg-white/20 px-2 py-0.5 text-xl font-bold">{data.total}</div>
        </Card>
        <Card className="flex flex-row items-center justify-between space-x-4 border-none bg-white p-4 shadow-sm">
          <div className="text-sm font-medium text-gray-500">Amaldagi INMlar</div>
          <div className="text-2xl font-bold text-gray-900">{data.active}</div>
        </Card>
        <Card className="flex flex-row items-center justify-between space-x-4 border-none bg-white p-4 shadow-sm">
          <div className="text-sm font-medium text-gray-500">Reyestrdan chiqarilgan INMlar</div>
          <div className="text-2xl font-bold text-gray-900">{data.inactive}</div>
        </Card>
      </div>
    )
  }

  return null
}
