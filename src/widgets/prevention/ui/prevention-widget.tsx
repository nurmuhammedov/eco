import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Badge } from '@/shared/components/ui/badge';
import { useCustomSearchParams } from '@/shared/hooks';
import { useAuth } from '@/shared/hooks/use-auth';
import { UserRoles } from '@/entities/user';
import Table from '@/features/prevention/ui/table';

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

const PROCESS_STATUSES = [
  { value: 'ALL', label: 'Barchasi' },
  { value: 'IN_PROGRESS', label: 'Jarayonda' },
  { value: 'COMPLETED', label: 'Yakunlangan' },
];

const PreventionWidget = () => {
  const { user } = useAuth();
  const { paramsObject, addParams } = useCustomSearchParams();
  const isRegional = user?.role === UserRoles.REGIONAL || user?.role === UserRoles.HEAD;
  const activeMonth = paramsObject.month || new Date().getMonth() + 1 + '';
  const activeType = paramsObject.mainTab || 'HF';
  const activeAssignment = paramsObject.assignment || !isRegional ? 'ASSIGNED' : 'UNASSIGNED';
  const activeStatus = paramsObject.status || 'ALL';

  return (
    <>
      <div className="flex flex-col gap-3 w-full mb-6">
        <Tabs value={activeMonth.toString()} onValueChange={(val) => addParams({ month: val, page: 1 })}>
          <TabsList className="justify-start overflow-x-auto h-auto p-1 flex-nowrap sm:flex-wrap">
            {MONTHS.map((month) => (
              <TabsTrigger key={month.value} value={month.value} className="flex-shrink-0 ">
                {month.label}
                <Badge
                  variant="destructive"
                  className="ml-2 group-data-[state=active]:bg-primary/10 group-data-[state=active]:text-primary"
                >
                  0
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

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

        {activeAssignment === 'ASSIGNED' && (
          <Tabs
            value={activeStatus}
            onValueChange={(val) => addParams({ status: val, page: 1 })}
            className="animate-in fade-in slide-in-from-top-2 duration-300"
          >
            <TabsList className="justify-start h-auto p-1">
              {PROCESS_STATUSES.map((status) => (
                <TabsTrigger key={status.value} value={status.value}>
                  {status.label}
                  <Badge
                    variant="destructive"
                    className="ml-2 group-data-[state=active]:bg-primary/10 group-data-[state=active]:text-primary"
                  >
                    0
                  </Badge>
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
