// src/widgets/register/ui/register-widget.tsx
import { EquipmentsList } from '@/features/register/equipments/ui/equipments-list';
import { HfList } from '@/features/register/hf/ui/hf-list';
import { IrsList } from '@/features/register/irs/ui/irs-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useRegister } from '../model/use-register';
import { RegisterActiveTab } from '../types';

const RegisterWidget = () => {
  const { t } = useTranslation('common'); // Assuming 'common' namespace has these translations
  const { activeTab, handleChangeTab } = useRegister();

  return (
    <Fragment>
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-2xl font-semibold uppercase">{t('menu.register')}</h5>
      </div>
      <Tabs defaultValue={activeTab} onValueChange={handleChangeTab}>
        <TabsList>
          <TabsTrigger value={RegisterActiveTab.HF}>XICHO</TabsTrigger>{' '}
          <TabsTrigger value={RegisterActiveTab.EQUIPMENTS}>Qurilmalar</TabsTrigger>
          <TabsTrigger value={RegisterActiveTab.IRS}>INM</TabsTrigger>
        </TabsList>
        <TabsContent value={RegisterActiveTab.HF} className="mt-4">
          <HfList />
        </TabsContent>
        <TabsContent value={RegisterActiveTab.EQUIPMENTS} className="mt-4">
          <EquipmentsList />
        </TabsContent>
        <TabsContent value={RegisterActiveTab.IRS} className="mt-4">
          <IrsList />
        </TabsContent>
      </Tabs>
    </Fragment>
  );
};

export default React.memo(RegisterWidget);
