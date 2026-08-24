import { ReactNode, useState } from 'react'
import { cn } from '@/shared/lib/utils'
import { FileText, FileCheck, Award, FileSignature, Scroll, Building2, ShieldAlert, Scan, Settings } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useData } from '@/shared/hooks'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'

type TabType = 'permits' | 'expertises'

const TABS: { id: TabType; label: string }[] = [
  { id: 'permits', label: 'Ruxsat etuvchi hujjatlar' },
  { id: 'expertises', label: 'Ekspertiza xulosalari' },
]

export const DocumentsStats = () => {
  const [activeTab, setActiveTab] = useState<TabType>('permits')
  const { data: permitsData } = useData<any>('/permits/count')
  const { data: conclusionsData } = useData<any>('/conclusions/count')

  const renderCleanCard = (
    title: string,
    value: number,
    icon: ReactNode,
    colorText: string,
    bgColor: string,
    link: string
  ) => (
    <Link
      to={link}
      className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md"
    >
      <div className="mb-4 flex items-center justify-between">
        <span aria-hidden="true" className={cn('rounded-xl p-2.5', bgColor, colorText)}>
          {icon}
        </span>
      </div>
      <div>
        <span className="mb-1 block text-2xl font-bold text-slate-900">{value?.toLocaleString()}</span>
        <span className="text-sm font-medium text-slate-500">{title}</span>
      </div>
    </Link>
  )

  const renderPermits = () => {
    const permits = {
      total: permitsData?.allCount || 0,
      permit: permitsData?.permissionCount || 0,
      license: permitsData?.licenseCount || 0,
      conclusion: permitsData?.conclusionCount || 0,
    }
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {renderCleanCard(
          'Barchasi',
          permits.total,
          <FileText className="h-6 w-6" />,
          'text-blue-600',
          'bg-blue-50',
          '/permits?tab=ALL'
        )}
        {renderCleanCard(
          'Ruxsatnoma',
          permits.permit,
          <FileCheck className="h-6 w-6" />,
          'text-emerald-600',
          'bg-emerald-50',
          '/permits?tab=PERMISSION'
        )}
        {renderCleanCard(
          'Litsenziya',
          permits.license,
          <Award className="h-6 w-6" />,
          'text-purple-600',
          'bg-purple-50',
          '/permits?tab=LICENSE'
        )}
        {renderCleanCard(
          'Xulosa',
          permits.conclusion,
          <FileSignature className="h-6 w-6" />,
          'text-orange-600',
          'bg-orange-50',
          '/permits?tab=CONCLUSION'
        )}
      </div>
    )
  }

  const renderExpertises = () => {
    const expertises = {
      total: conclusionsData?.allCount || 0,
      lh: conclusionsData?.lhcount || 0,
      tq: conclusionsData?.tqcount || 0,
      bi: conclusionsData?.bicount || 0,
      xd: conclusionsData?.xdcount || 0,
      ix: conclusionsData?.ixcount || 0,
    }
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {renderCleanCard(
          'Jami',
          expertises.total,
          <FileText className="h-6 w-6" />,
          'text-blue-600',
          'bg-blue-50',
          '/accreditations?tab=ALL'
        )}
        {renderCleanCard(
          'Xavfli ishlab chiqarish obyektini qurish, kengaytirish, qayta qurish, texnik jihatdan qayta jihozlash, konservatsiyalash va tugatishga doir loyiha hujjatlari (LH)',
          expertises.lh,
          <Scroll className="h-6 w-6" />,
          'text-indigo-600',
          'bg-indigo-50',
          '/accreditations?tab=LH'
        )}
        {renderCleanCard(
          'Xavfli ishlab chiqarish obyektida qo‘llaniladigan texnika qurilmalari (TQ)',
          expertises.tq,
          <Settings className="h-6 w-6" />,
          'text-orange-600',
          'bg-orange-50',
          '/accreditations?tab=TQ'
        )}
        {renderCleanCard(
          'Xavfli ishlab chiqarish obyektidagi binolar va inshootlar (BI)',
          expertises.bi,
          <Building2 className="h-6 w-6" />,
          'text-emerald-600',
          'bg-emerald-50',
          '/accreditations?tab=BI'
        )}
        {renderCleanCard(
          'Sanoat xavfsizligi deklaratsiyasi (XD)',
          expertises.xd,
          <ShieldAlert className="h-6 w-6" />,
          'text-red-600',
          'bg-red-50',
          '/accreditations?tab=XD'
        )}
        {renderCleanCard(
          'Xavfli ishlab chiqarish obyektlarini identifikatsiyalash (IX)',
          expertises.ix,
          <Scan className="h-6 w-6" />,
          'text-purple-600',
          'bg-purple-50',
          '/accreditations?tab=IX'
        )}
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabType)}>
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Hujjatlar</h2>
            <p className="mt-1 text-sm text-slate-500">Barcha hujjatlar holati bo‘yicha umumiy hisobot</p>
          </div>

          <TabsList className="h-auto w-full flex-wrap rounded-lg bg-slate-100 p-1 md:w-fit">
            {TABS.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex-1 rounded-md px-5 py-2 font-medium text-slate-600 md:flex-none"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="permits" className="mt-0">
          {renderPermits()}
        </TabsContent>

        <TabsContent value="expertises" className="mt-0">
          {renderExpertises()}
        </TabsContent>
      </Tabs>
    </div>
  )
}
