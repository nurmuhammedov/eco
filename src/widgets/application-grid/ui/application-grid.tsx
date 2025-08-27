import React, { useMemo } from 'react';
import { MainCardsList } from './main-card-application';
import TabsLayout from '@/shared/layouts/ui/tabs-layout';
import { useApplicationGrid } from '@/widgets/application-grid';
import ApplicationCard from '@/entities/create-application/ui/application-card';
import { APPLICATION_CATEGORIES, ApplicationCategory } from '@/entities/create-application';
import { useAuth } from '@/shared/hooks/use-auth';
import { UserRoles } from '@/entities/user';

export const ApplicationsGrid: React.FC = () => {
  const { activeTab, mainCards, selectedMainCard, handleMainCardSelect, handleChangeTab, displayedSubCards } =
    useApplicationGrid();
  const { user } = useAuth();

  // Memoize values to prevent unnecessary calculations
  const hasMainCards = useMemo(() => mainCards.length > 0, [mainCards]);
  const hasSubCards = useMemo(() => displayedSubCards.length > 0, [displayedSubCards]);

  // Empty state rendering - extracted for clarity and reusability
  const renderEmptyState = () => {
    // Case 1: No main application in the category
    if (!hasMainCards) {
      return (
        <div className="text-center py-12">
          <p className="text-slate-500">Bu toifada hozircha arizalar mavjud emas</p>
        </div>
      );
    }

    // Case 2: Has main application, but no sub application for selected main card
    if (selectedMainCard && !hasSubCards) {
      return (
        <div className="text-center py-12">
          <p className="text-slate-500">Tanlangan toifaga oid arizalar mavjud emas</p>
        </div>
      );
    }

    return null;
  };

  // Sub application grid with memoized grid classes for better performance
  const SubApplication = React.memo(() => {
    const gridClasses = 'grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 gap-4';

    if (!hasSubCards) {
      return null;
    }

    return (
      <div className={gridClasses}>
        {displayedSubCards.map((application) => (
          <ApplicationCard key={application.id} application={application} />
        ))}
      </div>
    );
  });

  SubApplication.displayName = 'SubApplication';

  return (
    <TabsLayout
      activeTab={activeTab}
      defaultValue={activeTab}
      classNameTabList="px-4 py-6"
      tabs={
        user?.role == UserRoles.INDIVIDUAL
          ? [
              {
                id: ApplicationCategory.HOKQ,
                name: 'Xavfli obyektlar va qurilmalar',
              },
            ]
          : user?.role == UserRoles.INSPECTOR
            ? [
                {
                  id: ApplicationCategory.ILLEGAL,
                  name: 'XICHO',
                },
              ]
            : APPLICATION_CATEGORIES
      }
      classNameTrigger="text-base mx-0.5"
      className="font-medium 3xl:font-semibold"
      onTabChange={(value) => handleChangeTab(value as ApplicationCategory)}
    >
      {/* Main applications section */}
      {activeTab && hasMainCards && (
        <MainCardsList cards={mainCards} selectedCard={selectedMainCard} onCardSelect={handleMainCardSelect} />
      )}

      {/* Sub applications grid */}
      <SubApplication />

      {/* Empty states */}
      {activeTab && !hasSubCards && renderEmptyState()}
    </TabsLayout>
  );
};

// Add display name for better debugging
ApplicationsGrid.displayName = 'ApplicationsGrid';

export default React.memo(ApplicationsGrid);
