import React, { useMemo } from 'react'
import { MainCardsList } from './main-card-application'
import TabsLayout from '@/shared/layouts/ui/tabs-layout'
import { useApplicationGrid } from '@/widgets/application-grid'
import ApplicationCard from '@/entities/create-application/ui/application-card'
import { APPLICATION_CATEGORIES, ApplicationCategory } from '@/entities/create-application'
import { useAuth } from '@/shared/hooks/use-auth'
import { UserRoles } from '@/entities/user'

export const ApplicationsGridIns: React.FC = () => {
  const { activeTab, mainCards, selectedMainCard, handleMainCardSelect, handleChangeTab, displayedSubCards } =
    useApplicationGrid()
  const { user } = useAuth()

  const hasMainCards = useMemo(() => mainCards.length > 0, [mainCards])
  const hasSubCards = useMemo(() => displayedSubCards.length > 0, [displayedSubCards])

  const renderEmptyState = () => {
    if (!hasMainCards) {
      return (
        <div className="py-12 text-center">
          <p className="text-slate-500">Bu toifada hozircha arizalar mavjud emas</p>
        </div>
      )
    }

    if (selectedMainCard && !hasSubCards) {
      return (
        <div className="py-12 text-center">
          <p className="text-slate-500">Tanlangan toifaga oid arizalar mavjud emas</p>
        </div>
      )
    }

    return null
  }

  const SubApplication = React.memo(() => {
    const gridClasses = 'grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 gap-4'

    if (!hasSubCards) {
      return null
    }

    return (
      <div className={gridClasses}>
        {displayedSubCards.map((application) => (
          <ApplicationCard key={application.id} application={application} />
        ))}
      </div>
    )
  })

  SubApplication.displayName = 'SubApplication'

  return (
    <TabsLayout
      activeTab={activeTab}
      defaultValue={activeTab}
      classNameTabList="px-4 py-6"
      tabs={
        user?.role == UserRoles.INDIVIDUAL
          ? [
              {
                id: ApplicationCategory.EQUIPMENTS,
                name: 'Xavfli obyektlar va qurilmalar',
              },
            ]
          : user?.role == UserRoles.INSPECTOR
            ? [
                {
                  id: ApplicationCategory.ILLEGAL_HF,
                  name: 'XICHO',
                },
                {
                  id: ApplicationCategory.ILLEGAL_EQUIPMENTS,
                  name: 'Xavfli obyektlar va qurilmalar',
                },
                {
                  id: ApplicationCategory.ILLEGAL_XRAY,
                  name: 'Rentgen',
                },
              ]
            : user?.role == UserRoles.MANAGER
              ? [
                  {
                    id: ApplicationCategory.ILLEGAL_XRAY,
                    name: 'Rentgen',
                  },
                ]
              : APPLICATION_CATEGORIES
      }
      classNameTrigger="text-base mx-0.5"
      className="3xl:font-semibold font-medium"
      onTabChange={(value) => handleChangeTab(value as ApplicationCategory)}
    >
      {activeTab && hasMainCards && (
        <MainCardsList cards={mainCards} selectedCard={selectedMainCard} onCardSelect={handleMainCardSelect} />
      )}

      <SubApplication />

      {activeTab && !hasSubCards && renderEmptyState()}
    </TabsLayout>
  )
}

ApplicationsGridIns.displayName = 'ApplicationsGrid'
