import { InspectionList } from '@/features/inspections/ui/inspection-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import useCustomSearchParams from '@/shared/hooks/api/useSearchParams';
import { useAuth } from '@/shared/hooks/use-auth';
import React from 'react';
import { UserRoles } from '@/entities/user';
import { useData } from '@/shared/hooks';
import { Badge } from '@/shared/components/ui/badge';
import clsx from 'clsx';
import { cn } from '@/shared/lib/utils';
import { getCurrentMonthEnum, MONTHS } from '@/widgets/prevention/ui/prevention-widget';

export enum InspectionStatus {
  ALL = 'ALL',
  NEW = 'NEW',
  ASSIGNED = 'ASSIGNED',
}

export enum InspectionSubMenuStatus {
  CONDUCTED = 'CONDUCTED',
  ASSIGNED = 'ASSIGNED',
  COMPLETED = 'COMPLETED',
}

export interface CountDto {
  allCount: number;
  newCount: number;
  assignedCount: number;
  conductedCount: number;
}

export const defaultCountDto: CountDto = {
  allCount: 0,
  newCount: 0,
  assignedCount: 0,
  conductedCount: 0,
};

const Cards = ({ activeRiskLevel, onTabChange }: any) => {
  const stats = MONTHS?.map((month) => ({
    id: month?.value,
    name: month?.label,
    count: month?.count,
    inactiveClass: 'bg-[#016B7B]/10 border-[#016B7B]/20 text-[#016B7B]',
    activeClass: 'bg-[#016B7B] border-[#015a67] text-white shadow-sm',
  }));

  return (
    <div className="flex w-full gap-2 overflow-x-auto  no-scrollbar mb-2">
      {stats.map((stat) => {
        const isActive = activeRiskLevel === stat.id;

        return (
          <div
            key={stat.id}
            onClick={() => onTabChange(stat.id)}
            className={clsx(
              'relative flex-1 rounded-lg border p-3 flex items-center justify-between cursor-pointer transition-colors duration-200 select-none',
              isActive ? stat.activeClass : `${stat.inactiveClass} hover:opacity-80`,
            )}
          >
            <div className="w-full">
              <div className="flex gap-2 justify-between w-full">
                <p className="text-sm font-medium mb-1 opacity-90">{stat.name}</p>
                <p className="text-sm font-medium mb-1 opacity-90">{new Date().getFullYear()}</p>
              </div>
              <h3 className={clsx('text-2xl font-bold')}>{stat.count}</h3>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const InspectionWidget: React.FC = () => {
  const { user } = useAuth();
  const { paramsObject, addParams } = useCustomSearchParams();
  const isInspector = user?.role == UserRoles.INSPECTOR;
  const isLegal = user?.role == UserRoles.LEGAL;
  const activeTab = paramsObject.status;
  const activeSubTab = paramsObject.subStatus;
  const activeProcess = paramsObject.process;
  const month = paramsObject.month || getCurrentMonthEnum();

  const { data: countObject = defaultCountDto } = useData<CountDto>('/inspections/count');

  const handleTabChange = (value: string) => {
    addParams({ status: value, page: 1 });
  };

  const handleSubTabChange = (value: string) => {
    addParams({ subStatus: value, page: 1 });
  };

  if (isInspector || isLegal) {
    return (
      <>
        <Cards activeRiskLevel={month.toString()} onTabChange={(val: string) => addParams({ month: val, page: 1 })} />

        <Tabs value={activeSubTab || InspectionSubMenuStatus.ASSIGNED} onValueChange={handleSubTabChange}>
          <div className={cn('flex justify-between overflow-x-auto no-scrollbar overflow-y-hidden')}>
            <TabsList>
              <TabsTrigger value={InspectionSubMenuStatus.ASSIGNED}>
                Tekshiruv o‘tkazilmagan
                <Badge variant="destructive" className="ml-2">
                  {countObject.assignedCount || 0}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value={InspectionSubMenuStatus.CONDUCTED}>
                Tekshiruv o‘tkazilgan
                <Badge variant="destructive" className="ml-2">
                  {countObject.conductedCount || 0}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value={InspectionSubMenuStatus.CONDUCTED}>
            <InspectionList />
          </TabsContent>
          <TabsContent value={InspectionSubMenuStatus.ASSIGNED}>
            <InspectionList />
          </TabsContent>
        </Tabs>
      </>
    );
  }

  return (
    <>
      <Cards activeRiskLevel={month.toString()} onTabChange={(val: string) => addParams({ month: val, page: 1 })} />

      <Tabs value={activeTab || InspectionStatus.ALL} onValueChange={handleTabChange}>
        <div className={cn('flex justify-between overflow-x-auto no-scrollbar overflow-y-hidden')}>
          <TabsList>
            <TabsTrigger value={InspectionStatus.ALL}>
              Barchasi
              <Badge variant="destructive" className="ml-2">
                {countObject.allCount || 0}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value={InspectionStatus.NEW}>
              Inspektor belgilanmaganlar
              <Badge variant="destructive" className="ml-2">
                {countObject.newCount || 0}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value={InspectionStatus.ASSIGNED}>
              Inspektor belgilanganlar
              <Badge variant="destructive" className="ml-2">
                {(countObject.assignedCount || 0) + (countObject.conductedCount || 0)}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value={InspectionStatus.ALL}>
          <InspectionList />
        </TabsContent>
        <TabsContent value={InspectionStatus.NEW}>
          <InspectionList />
        </TabsContent>
        <TabsContent value={InspectionStatus.ASSIGNED}>
          <div className="mb-3">
            <Tabs
              value={activeSubTab || InspectionSubMenuStatus.ASSIGNED}
              onValueChange={(value) => {
                addParams({ subStatus: value, page: 1 });
              }}
            >
              <div className={cn('flex justify-between overflow-x-auto no-scrollbar overflow-y-hidden')}>
                <TabsList>
                  <TabsTrigger value={InspectionSubMenuStatus.ASSIGNED}>
                    Tekshiruv o‘tkazilmagan
                    <Badge variant="destructive" className="ml-2">
                      {countObject.assignedCount || 0}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value={InspectionSubMenuStatus.CONDUCTED}>
                    Tekshiruv o‘tkazilgan
                    <Badge variant="destructive" className="ml-2">
                      {countObject.conductedCount || 0}
                    </Badge>
                  </TabsTrigger>
                </TabsList>
              </div>
            </Tabs>
          </div>
          {activeSubTab == InspectionSubMenuStatus.CONDUCTED ? (
            <div className="mb-3">
              <Tabs
                value={activeProcess || 'IN_PROCESS'}
                onValueChange={(value) => {
                  addParams({ process: value, page: 1 });
                }}
              >
                <div className={cn('flex justify-between overflow-x-auto no-scrollbar overflow-y-hidden')}>
                  <TabsList>
                    <TabsTrigger value="IN_PROCESS">
                      Jarayonda
                      <Badge variant="destructive" className="ml-2">
                        0
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="FINISHED">
                      Yakunlangan
                      <Badge variant="destructive" className="ml-2">
                        0
                      </Badge>
                    </TabsTrigger>
                  </TabsList>
                </div>
              </Tabs>
            </div>
          ) : null}
          <InspectionList />
        </TabsContent>
      </Tabs>
    </>
  );
};
