import { usePreventions } from '@/entities/prevention'
import { UserRoles } from '@/entities/user'
import { PreventionListTable } from '@/features/prevention'
import Filter from '@/shared/components/common/filter'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import useCustomSearchParams from '@/shared/hooks/api/useSearchParams'
import { useAuth } from '@/shared/hooks/use-auth'
import { PreventionFileHandler } from './ui/prevention-file-handler'

export default function PreventionsPage() {
  const { paramsObject, addParams } = useCustomSearchParams()
  const { user } = useAuth()
  const isPassed =
    paramsObject.isPassed || user?.role === UserRoles.LEGAL || user?.role === UserRoles.INDIVIDUAL ? 'true' : 'false'
  const currentYear = new Date().getFullYear()

  const { data: preventionsData, isLoading } = usePreventions({
    ...paramsObject,
    isPassed,
    year: !isPassed ? paramsObject.year || currentYear : undefined,
    size: paramsObject?.size || '10',
    page: paramsObject.page || '1',
  })

  const handleTabChange = (value: string) => {
    addParams({ isPassed: value, year: String(currentYear) }, 'page')
  }

  const handleYearChange = (value: string) => {
    addParams({ year: value }, 'page')
  }

  const years = Array.from({ length: 10 }, (_, i) => currentYear - i)

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Profilaktika</h1>
      <Tabs value={String(isPassed)} onValueChange={handleTabChange}>
        <div className="flex items-center justify-between">
          <TabsList>
            {user?.role !== UserRoles.LEGAL && user?.role !== UserRoles.INDIVIDUAL && (
              <TabsTrigger value="false">Tadbir o'tkazilmaganlar</TabsTrigger>
            )}
            <TabsTrigger value="true">Tadbir o'tkazilganlar</TabsTrigger>
          </TabsList>
          {isPassed == 'false' && (
            <div className="flex items-center gap-4">
              <PreventionFileHandler year={paramsObject.year || currentYear} />
              <Select onValueChange={handleYearChange} defaultValue={String(paramsObject.year || currentYear)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Yilni tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <TabsContent value="false" className="mt-4">
          <Filter inputKeys={['search']} />
          <PreventionListTable data={preventionsData} isLoading={isLoading} isPassed={false} />
        </TabsContent>
        <TabsContent value="true" className="mt-4">
          <Filter inputKeys={['search', 'startDate', 'endDate']} />
          <PreventionListTable data={preventionsData} isLoading={isLoading} isPassed={true} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
