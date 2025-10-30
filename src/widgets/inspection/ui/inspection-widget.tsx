import { InspectionList } from '@/features/inspection/ui/inspection-list';
import { useRiskAnalysisIntervalsQuery } from '@/shared/api/dictionaries/hooks/use-risk-analysis-intervals-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import useCustomSearchParams from '@/shared/hooks/api/useSearchParams';
import { useAuth } from '@/shared/hooks/use-auth';
import { getDate } from '@/shared/utils/date';
import React, { useMemo } from 'react';
import { UserRoles } from '@/entities/user';

export enum InspectionStatus {
  NEW = 'NEW',
  IN_PROCESS = 'IN_PROCESS',
  CONDUCTED = 'CONDUCTED',
}

export const InspectionWidget: React.FC = () => {
  const { user } = useAuth();
  const { paramsObject, addParams } = useCustomSearchParams();
  const { data: intervalOptionsData, isLoading: isLoadingIntervals } = useRiskAnalysisIntervalsQuery();

  const isInspector = user?.role == UserRoles.INSPECTOR;
  const isLegal = user?.role == UserRoles.LEGAL;
  const activeTab = paramsObject.status;
  const defaultTab = isLegal ? InspectionStatus.CONDUCTED : InspectionStatus.NEW;

  const handleTabChange = (value: string) => {
    addParams({ status: value });
  };

  const handleIntervalChange = (value: string) => {
    addParams({ intervalId: value });
  };

  const intervalOptions = useMemo(() => {
    if (!intervalOptionsData) return [];
    return intervalOptionsData.map((interval) => (
      <SelectItem key={interval.id} value={interval.id.toString()}>
        <span className="whitespace-nowrap">{`${getDate(interval.startDate)} - ${getDate(interval.endDate)}`}</span>
      </SelectItem>
    ));
  }, [intervalOptionsData]);

  if (isInspector) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Tekshiruvlar</h2>
          <Select
            onValueChange={handleIntervalChange}
            defaultValue={paramsObject.intervalId?.toString() || user?.interval.id.toString()}
            disabled={isLoadingIntervals}
          >
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Davrni tanlang" />
            </SelectTrigger>
            <SelectContent>{intervalOptions}</SelectContent>
          </Select>
        </div>

        <Tabs value={activeTab || InspectionStatus.IN_PROCESS} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value={InspectionStatus.IN_PROCESS}>Tekshiruv rejalashtirilgan</TabsTrigger>
            <TabsTrigger value={InspectionStatus.CONDUCTED}>Tekshiruv o‘tkazilgan</TabsTrigger>
          </TabsList>
          <TabsContent value={InspectionStatus.IN_PROCESS}>
            <InspectionList />
          </TabsContent>
          <TabsContent value={InspectionStatus.CONDUCTED}>
            <InspectionList />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Tekshiruvlar</h2>
        <Select
          onValueChange={handleIntervalChange}
          defaultValue={paramsObject.intervalId?.toString() || user?.interval.id.toString()}
          disabled={isLoadingIntervals}
        >
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Davrni tanlang" />
          </SelectTrigger>
          <SelectContent>{intervalOptions}</SelectContent>
        </Select>
      </div>

      <Tabs value={activeTab || defaultTab} onValueChange={handleTabChange}>
        <TabsList>
          {!isLegal && <TabsTrigger value={InspectionStatus.NEW}>Inspektor belgilanmaganlar</TabsTrigger>}
          {isLegal ? (
            <>
              <TabsTrigger value={InspectionStatus.CONDUCTED}>Tekshiruv o‘tkazilgan</TabsTrigger>
              <TabsTrigger value={InspectionStatus.IN_PROCESS}>Inspektor belgilanganlar</TabsTrigger>
            </>
          ) : (
            <>
              <TabsTrigger value={InspectionStatus.IN_PROCESS}>Inspektor belgilanganlar</TabsTrigger>
              <TabsTrigger value={InspectionStatus.CONDUCTED}>Tekshiruv o‘tkazilgan</TabsTrigger>
            </>
          )}
        </TabsList>
        {!isLegal && (
          <TabsContent value={InspectionStatus.NEW}>
            <InspectionList />
          </TabsContent>
        )}
        <TabsContent value={InspectionStatus.IN_PROCESS}>
          <InspectionList />
        </TabsContent>
        <TabsContent value={InspectionStatus.CONDUCTED}>
          <InspectionList />
        </TabsContent>
      </Tabs>
    </div>
  );
};
