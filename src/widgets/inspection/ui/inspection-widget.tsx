import { InspectionList } from '@/features/inspections/ui/inspection-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import useCustomSearchParams from '@/shared/hooks/api/useSearchParams';
import { useAuth } from '@/shared/hooks/use-auth';
import React from 'react';
import { UserRoles } from '@/entities/user';
import { useData } from '@/shared/hooks';
import { Badge } from '@/shared/components/ui/badge';

export enum InspectionStatus {
  ALL = 'ALL',
  NEW = 'NEW',
  ASSIGNED = 'ASSIGNED',
}

export enum InspectionSubMenuStatus {
  CONDUCTED = 'CONDUCTED',
  ASSIGNED = 'ASSIGNED',
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

export const InspectionWidget: React.FC = () => {
  const { user } = useAuth();
  const { paramsObject, addParams } = useCustomSearchParams();
  const isInspector = user?.role == UserRoles.INSPECTOR;
  const isLegal = user?.role == UserRoles.LEGAL;
  const activeTab = paramsObject.status;
  const activeSubTab = paramsObject.subStatus;

  const { data: countObject = defaultCountDto } = useData<CountDto>('/inspections/count');

  const handleTabChange = (value: string) => {
    addParams({ status: value, page: 1 });
  };

  const handleSubTabChange = (value: string) => {
    addParams({ subStatus: value, page: 1 });
  };

  if (isInspector || isLegal) {
    return (
      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-2xl font-bold">Tekshiruvlar</h2>
        </div>

        <Tabs value={activeSubTab || InspectionSubMenuStatus.ASSIGNED} onValueChange={handleSubTabChange}>
          <TabsList>
            <TabsTrigger value={InspectionSubMenuStatus.ASSIGNED}>
              Tekshiruv o‘tkazilmagan
              {countObject.assignedCount ? (
                <Badge variant="destructive" className="ml-2">
                  {countObject.assignedCount}
                </Badge>
              ) : null}
            </TabsTrigger>
            <TabsTrigger value={InspectionSubMenuStatus.CONDUCTED}>
              Tekshiruv o‘tkazilgan
              {countObject.conductedCount ? (
                <Badge variant="destructive" className="ml-2">
                  {countObject.conductedCount}
                </Badge>
              ) : null}
            </TabsTrigger>
          </TabsList>
          <TabsContent value={InspectionSubMenuStatus.CONDUCTED}>
            <InspectionList />
          </TabsContent>
          <TabsContent value={InspectionSubMenuStatus.ASSIGNED}>
            <InspectionList />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-bold">Tekshiruvlar</h2>
      </div>

      <Tabs value={activeTab || InspectionStatus.ALL} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value={InspectionStatus.ALL}>
            Barchasi
            {countObject.allCount ? (
              <Badge variant="destructive" className="ml-2">
                {countObject.allCount}
              </Badge>
            ) : null}
          </TabsTrigger>
          <TabsTrigger value={InspectionStatus.NEW}>
            Inspektor belgilanmaganlar
            {countObject.newCount ? (
              <Badge variant="destructive" className="ml-2">
                {countObject.newCount}
              </Badge>
            ) : null}
          </TabsTrigger>
          <TabsTrigger value={InspectionStatus.ASSIGNED}>
            Inspektor belgilanganlar
            {countObject.assignedCount ? (
              <Badge variant="destructive" className="ml-2">
                {countObject.assignedCount}
              </Badge>
            ) : null}
          </TabsTrigger>
        </TabsList>
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
              <TabsList>
                <TabsTrigger value={InspectionSubMenuStatus.ASSIGNED}>
                  Tekshiruv o‘tkazilmagan
                  {countObject.assignedCount ? (
                    <Badge variant="destructive" className="ml-2">
                      {countObject.assignedCount}
                    </Badge>
                  ) : null}
                </TabsTrigger>
                <TabsTrigger value={InspectionSubMenuStatus.CONDUCTED}>
                  Tekshiruv o‘tkazilgan
                  {countObject.conductedCount ? (
                    <Badge variant="destructive" className="ml-2">
                      {countObject.conductedCount}
                    </Badge>
                  ) : null}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <InspectionList />
        </TabsContent>
      </Tabs>
    </div>
  );
};
