import TabsLayout from '@/shared/layouts/ui/tabs-layout';
import { useApplicationGrid } from '@/widgets/application-grid';
import ApplicationCard from '@/entities/create-application/ui/application-card';
import { APPLICATION_CATEGORIES, ApplicationCategory } from '@/entities/create-application';

export const ApplicationsGrid = () => {
  const { activeTab, filteredCards, handleChangeTab } = useApplicationGrid();

  return (
    <TabsLayout
      activeTab={activeTab}
      defaultValue={activeTab}
      className="font-semibold"
      classNameTrigger="text-base"
      classNameTabList="px-4 py-6"
      tabs={APPLICATION_CATEGORIES}
      onTabChange={(value) => handleChangeTab(value as ApplicationCategory)}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 gap-6">
        {filteredCards.map((application) => (
          <ApplicationCard key={application.id} application={application} />
        ))}
      </div>
    </TabsLayout>
  );
};
