import { UserRoles } from '@/entities/user';
import { EquipmentsList } from '@/features/register/equipments/ui/equipments-list';
import { HfList } from '@/features/register/hf/ui/hf-list';
import { IrsList } from '@/features/register/irs/ui/irs-list';
import { XrayList } from '@/features/register/xray/ui/xray-list';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { useAuth } from '@/shared/hooks/use-auth';
import React, { Fragment, useState } from 'react';
import { RegisterActiveTab } from '../types';
import { useCustomSearchParams, useData } from '@/shared/hooks';
import { Button } from '@/shared/components/ui/button';
import { Download } from 'lucide-react';
import Filter from '@/shared/components/common/filter';
import { apiClient } from '@/shared/api';
import { format } from 'date-fns';

const RegisterWidget = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useAuth();
  const {
    paramsObject: {
      mode = '',
      search = '',
      hfOfficeId = '',
      eqOfficeId = '',
      xrayRegionId = '',
      irsRegionId = '',
      status = 'ALL',
      type = 'ALL',
      tab = user?.role != UserRoles.INDIVIDUAL ? RegisterActiveTab.HF : RegisterActiveTab.EQUIPMENTS,
    },
    addParams,
  } = useCustomSearchParams();

  const { data: hfCount = 0 } = useData<number>('/hf/count', user?.role != UserRoles.INDIVIDUAL, { mode });
  const { data: equipmentsCount = 0 } = useData<number>('/equipments/count', true, { mode });
  const { data: irsCount = 0 } = useData<number>('/irs/count', user?.role != UserRoles.INDIVIDUAL, { mode });
  const { data: xrayCount = 0 } = useData<number>('/xrays/count', user?.role != UserRoles.INDIVIDUAL, { mode });

  const handleDownloadHFExel = () => {
    setIsLoading(true);
    apiClient
      .downloadFile<Blob>('/hf/export/excel', {
        mode,
        search,
        officeId: hfOfficeId,
      })
      .then((res) => {
        const blob = res.data;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const today = new Date();
        const filename = `XICHOlar (${format(today, 'dd.MM.yyyy')}).xlsx`;
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleDownloadEquipmentsExel = () => {
    setIsLoading(true);
    apiClient
      .downloadFile<Blob>('/equipments/export/excel', {
        mode,
        officeId: eqOfficeId,
        search,
        type: type !== 'ALL' ? type : '',
        status: status !== 'ALL' ? status : '',
      })
      .then((res) => {
        const blob = res.data;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const today = new Date();
        const filename = `Qurilmalar (${format(today, 'dd.MM.yyyy')}).xlsx`;
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleDownloadIRSExel = () => {
    setIsLoading(true);
    apiClient
      .downloadFile<Blob>('/irs/export/excel', {
        mode,
        search,
        regionId: irsRegionId,
      })
      .then((res) => {
        const blob = res.data;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const today = new Date();
        const filename = `INMlar (${format(today, 'dd.MM.yyyy')}).xlsx`;
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleDownloadXRaysExel = () => {
    setIsLoading(true);
    apiClient
      .downloadFile<Blob>('/xrays/export/excel', {
        mode,
        search,
        regionId: xrayRegionId,
      })
      .then((res) => {
        const blob = res.data;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const today = new Date();
        const filename = `Rentgenlar (${format(today, 'dd.MM.yyyy')}).xlsx`;
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Fragment>
      <Tabs value={tab} onValueChange={(tab: string) => addParams({ tab: tab.toString() }, 'page', 'type')}>
        <div className={'flex justify-between items-center'}>
          {user?.role != UserRoles.INDIVIDUAL ? (
            <TabsList>
              <TabsTrigger value={RegisterActiveTab.HF}>
                XICHO
                <Badge variant="destructive" className="ml-2">
                  {hfCount}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value={RegisterActiveTab.EQUIPMENTS}>
                Qurilmalar
                <Badge variant="destructive" className="ml-2">
                  {equipmentsCount}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value={RegisterActiveTab.IRS}>
                INM
                <Badge variant="destructive" className="ml-2">
                  {irsCount}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value={RegisterActiveTab.XRAY}>
                Rentgenlar
                <Badge variant="destructive" className="ml-2">
                  {xrayCount}
                </Badge>
              </TabsTrigger>
            </TabsList>
          ) : (
            <TabsList>
              <TabsTrigger value={RegisterActiveTab.EQUIPMENTS}>
                Qurilmalar
                <Badge variant="destructive" className="ml-2">
                  {equipmentsCount}
                </Badge>
              </TabsTrigger>
            </TabsList>
          )}
          <div className="flex justify-start items-center gap-2">
            <Filter
              className=""
              inputKeys={
                tab == RegisterActiveTab.HF
                  ? ['mode', 'hfOfficeId']
                  : tab == RegisterActiveTab.EQUIPMENTS
                    ? ['mode', 'eqOfficeId']
                    : tab == RegisterActiveTab.IRS
                      ? ['mode', 'irsRegionId']
                      : ['mode', 'xrayRegionId']
              }
            />
            {type !== 'ALL' && (
              <Button
                disabled={isLoading}
                loading={isLoading}
                onClick={
                  tab == RegisterActiveTab.HF
                    ? handleDownloadHFExel
                    : tab == RegisterActiveTab.EQUIPMENTS
                      ? handleDownloadEquipmentsExel
                      : tab == RegisterActiveTab.IRS
                        ? handleDownloadIRSExel
                        : handleDownloadXRaysExel
                }
              >
                <Download /> Exel
              </Button>
            )}
          </div>
        </div>
        <TabsContent value={RegisterActiveTab.HF} className="mt-3">
          <HfList />
        </TabsContent>
        <TabsContent value={RegisterActiveTab.EQUIPMENTS} className="mt-3">
          <EquipmentsList />
        </TabsContent>
        <TabsContent value={RegisterActiveTab.IRS} className="mt-3">
          <IrsList />
        </TabsContent>
        <TabsContent value={RegisterActiveTab.XRAY} className="mt-3">
          <XrayList />
        </TabsContent>
      </Tabs>
    </Fragment>
  );
};

export default React.memo(RegisterWidget);
