import { CadastreList } from '@/features/cadastre/ui/cadastre-list';
import { DeclarationList } from '@/features/cadastre/ui/declaration-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Fragment } from 'react';
import { useCadastre } from '../model/use-cadastre';
import { CadastreTab } from '../types';

const Cadastre = () => {
  const { activeTab, handleChangeTab } = useCadastre();

  return (
    <Fragment>
      <Tabs defaultValue={activeTab} onValueChange={handleChangeTab} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value={CadastreTab.CADASTRE}>TXYZ kadastr pasportlari</TabsTrigger>
            <TabsTrigger value={CadastreTab.DECLARATIONS}>Sanoat xavfsizligi deklaratsiyalari</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={CadastreTab.CADASTRE} className="mt-4">
          <CadastreList />
        </TabsContent>
        <TabsContent value={CadastreTab.DECLARATIONS} className="mt-4">
          <DeclarationList />
        </TabsContent>
      </Tabs>
    </Fragment>
  );
};

export default Cadastre;
