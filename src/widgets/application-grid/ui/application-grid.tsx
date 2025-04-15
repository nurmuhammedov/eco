import { useMemo, useState } from 'react';
import TabsLayout from '@/shared/layouts/ui/tabs-layout';
import { ApplicationCategory } from '@/entities/application-create';
import ApplicationCard from '@/entities/application-create/ui/application-card';
import { APPLICATION_CARDS, APPLICATION_CATEGORIES } from '@/entities/application-create/model/constants.ts';

export const ApplicationsGrid = () => {
  const [activeCategory, setActiveCategory] = useState<ApplicationCategory | null>(ApplicationCategory.XICHO);
  const filteredCards = useMemo(() => {
    return activeCategory ? APPLICATION_CARDS.filter((app) => app.category === activeCategory) : APPLICATION_CARDS;
  }, [activeCategory]);
  return (
    <TabsLayout
      classNameTrigger="text-base"
      classNameTabList="px-4 py-6"
      tabs={APPLICATION_CATEGORIES}
      className="px-5 py-2.5 font-medium"
      activeTab={activeCategory as string}
      onTabChange={(value) => setActiveCategory(value as ApplicationCategory)}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 gap-6">
        {filteredCards.map((application) => (
          <ApplicationCard key={application.id} application={application} />
        ))}
      </div>
    </TabsLayout>
  );
};
