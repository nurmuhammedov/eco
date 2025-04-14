import { ReactNode } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';

interface Tab {
  id: string;
  name: string;
}

interface TabsLayoutProps {
  tabs: Tab[];
  action?: ReactNode;
  activeTab: string;
  className?: string;
  children: ReactNode;
  defaultValue?: string;
  onTabChange: (value: string) => void;
}

export const TabsLayout = ({
  tabs,
  action,
  defaultValue,
  activeTab,
  onTabChange,
  children,
  className = '',
}: TabsLayoutProps) => {
  return (
    <Tabs defaultValue={defaultValue} value={activeTab} onValueChange={onTabChange} className={className}>
      <div className="flex justify-between">
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {action}
      </div>
      <TabsContent value={activeTab}>{children}</TabsContent>
    </Tabs>
  );
};

export default TabsLayout;
