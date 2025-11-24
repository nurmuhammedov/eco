import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Badge } from '@/shared/components/ui/badge';
import { useCustomSearchParams, useData } from '@/shared/hooks';
import { useAuth } from '@/shared/hooks/use-auth';
import { UserRoles } from '@/entities/user';
import Table from '@/features/prevention/ui/table';
import { TabsLayout } from '@/shared/layouts';

const MONTHS = [
  { value: '1', label: 'Yanvar' },
  { value: '2', label: 'Fevral' },
  { value: '3', label: 'Mart' },
  { value: '4', label: 'Aprel' },
  { value: '5', label: 'May' },
  { value: '6', label: 'Iyun' },
  { value: '7', label: 'Iyul' },
  { value: '8', label: 'Avgust' },
  { value: '9', label: 'Sentabr' },
  { value: '10', label: 'Oktabr' },
  { value: '11', label: 'Noyabr' },
  { value: '12', label: 'Dekabr' },
];

const RISK_TYPES = [
  { value: 'HF', label: 'XICHO' },
  { value: 'IRS', label: 'INM' },
  { value: 'ELEVATOR', label: 'Lift' },
  { value: 'ATTRACTION', label: 'Attraksion' },
  { value: 'XRAY', label: 'Rentgen' },
  { value: 'LPG_POWERED', label: 'Yiliga 100 ming va undan ortiq kubometr tabiiy gazdan foydalanuvchi qurilma' },
];

const ASSIGNMENT_STATUSES = [
  { value: 'UNASSIGNED', label: 'Inspektor belgilanmaganlar' },
  { value: 'ASSIGNED', label: 'Inspektor belgilanganlar' },
];

const PreventionWidget = () => {
  const { user } = useAuth();
  const { paramsObject, addParams } = useCustomSearchParams();
  const isRegional = user?.role === UserRoles.REGIONAL || user?.role === UserRoles.HEAD;
  const activeMonth = paramsObject.month || new Date().getMonth() + 1 + '';
  const activeType = paramsObject.mainTab || 'HF';
  const activeRegion = paramsObject.region;
  const activeAssignment = paramsObject.assignment || !isRegional ? 'ASSIGNED' : 'UNASSIGNED';
  const { data = [] } = useData<{ id: number; name: string }[]>('/offices/select');

  return (
    <>
      <div className="flex flex-col gap-3 w-full mb-6">
        <Tabs
          value={activeMonth.toString()}
          onValueChange={(val) => addParams({ month: val, page: 1 })}
          className="w-full"
        >
          <TabsList className="grid w-full h-auto grid-cols-12 gap-1 p-1">
            {MONTHS.map((month) => (
              <TabsTrigger key={month.value} value={month.value} className="w-full flex justify-center px-1">
                <span className="truncate">{month.label}</span>
                <Badge
                  variant="destructive"
                  className="ml-2  group-data-[state=active]:bg-primary/10 group-data-[state=active]:text-primary"
                >
                  0
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {!!data && data?.length > 0 ? (
          <TabsLayout
            classNameTabList="!mb-0"
            tabs={
              data?.map((item) => ({
                id: item?.id?.toString(),
                name: item.name?.split(' ')?.[0] ? item.name?.split(' ')?.[0] : '',
              })) || []
            }
            activeTab={activeRegion?.toString() || data[0]?.id?.toString() || '1'}
            onTabChange={(val) => addParams({ region: val, page: 1 })}
          />
        ) : null}

        <Tabs value={activeType} onValueChange={(val) => addParams({ mainTab: val, page: 1 })}>
          <TabsList className="justify-start h-auto p-1 flex-wrap">
            {RISK_TYPES.map((type) => (
              <TabsTrigger key={type.value} value={type.value}>
                {type.label}
                <Badge
                  variant="destructive"
                  className="ml-2  group-data-[state=active]:bg-primary/10 group-data-[state=active]:text-primary"
                >
                  0
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {isRegional && (
          <Tabs value={activeAssignment} onValueChange={(val) => addParams({ assignment: val, page: 1 })}>
            <TabsList className="justify-start h-auto p-1">
              {ASSIGNMENT_STATUSES.map((status) => (
                <TabsTrigger key={status.value} value={status.value}>
                  {status.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}
      </div>
      <Table />
    </>
  );
};

export default PreventionWidget;
