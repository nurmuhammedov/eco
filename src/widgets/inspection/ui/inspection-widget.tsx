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
      <Tabs value={activeSubTab || InspectionSubMenuStatus.ASSIGNED} onValueChange={handleSubTabChange}>
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
        <TabsContent value={InspectionSubMenuStatus.CONDUCTED}>
          <InspectionList />
        </TabsContent>
        <TabsContent value={InspectionSubMenuStatus.ASSIGNED}>
          <InspectionList />
        </TabsContent>
      </Tabs>
    );
  }

  return (
    <Tabs value={activeTab || InspectionStatus.ALL} onValueChange={handleTabChange}>
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
          </Tabs>
        </div>
        <InspectionList />
      </TabsContent>
    </Tabs>
  );
};
