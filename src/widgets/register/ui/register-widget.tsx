// src/widgets/register/ui/register-widget.tsx
import { UserRoles } from '@/entities/user';
import { EquipmentsList } from '@/features/register/equipments/ui/equipments-list';
import { HfList } from '@/features/register/hf/ui/hf-list';
import { IrsList } from '@/features/register/irs/ui/irs-list';
import { XrayList } from '@/features/register/xray/ui/xray-list';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { useAuth } from '@/shared/hooks/use-auth';
import React, { Fragment } from 'react';
// import { useTranslation } from 'react-i18next';
import { useRegister } from '../model/use-register';
import { RegisterActiveTab } from '../types';

const RegisterWidget = () => {
  // const { t } = useTranslation('common');
  const { user } = useAuth();
  const { activeTab, handleChangeTab, hfCount, xrayCount, irsCount, equipmentsCount } = useRegister();

  return (
    <Fragment>
      {/*<div className="flex justify-between items-center mb-4">*/}
      {/*  <h5 className="text-2xl font-semibold uppercase">{t('menu.register')}</h5>*/}
      {/*</div>*/}
      <Tabs defaultValue={activeTab} onValueChange={handleChangeTab}>
        {user?.role != UserRoles.INDIVIDUAL ? (
          <TabsList>
            <TabsTrigger value={RegisterActiveTab.HF}>
              XICHO
              {hfCount ? (
                <Badge variant="destructive" className="ml-2">
                  {hfCount}
                </Badge>
              ) : null}
            </TabsTrigger>
            <TabsTrigger value={RegisterActiveTab.EQUIPMENTS}>
              Qurilmalar
              {equipmentsCount ? (
                <Badge variant="destructive" className="ml-2">
                  {equipmentsCount}
                </Badge>
              ) : null}
            </TabsTrigger>
            <TabsTrigger value={RegisterActiveTab.IRS}>
              INM
              {hfCount ? (
                <Badge variant="destructive" className="ml-2">
                  {irsCount}
                </Badge>
              ) : null}
            </TabsTrigger>
            <TabsTrigger value={RegisterActiveTab.XRAY}>
              Rentgenlar
              {hfCount ? (
                <Badge variant="destructive" className="ml-2">
                  {xrayCount}
                </Badge>
              ) : null}
            </TabsTrigger>
          </TabsList>
        ) : (
          <TabsList>
            <TabsTrigger value={RegisterActiveTab.EQUIPMENTS}>
              Qurilmalar
              {equipmentsCount ? (
                <Badge variant="destructive" className="ml-2">
                  {equipmentsCount}
                </Badge>
              ) : null}
            </TabsTrigger>
          </TabsList>
        )}
        <TabsContent value={RegisterActiveTab.HF} className="mt-4">
          <HfList />
        </TabsContent>
        <TabsContent value={RegisterActiveTab.EQUIPMENTS} className="mt-4">
          <EquipmentsList />
        </TabsContent>
        <TabsContent value={RegisterActiveTab.IRS} className="mt-4">
          <IrsList />
        </TabsContent>
        <TabsContent value={RegisterActiveTab.XRAY} className="mt-4">
          <XrayList />
        </TabsContent>
      </Tabs>
    </Fragment>
  );
};

export default React.memo(RegisterWidget);
