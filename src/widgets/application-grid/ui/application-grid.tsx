import React, { useMemo } from 'react'
import { MainCardsList } from './main-card-application'
import TabsLayout from '@/shared/layouts/ui/tabs-layout'
import { useApplicationGrid } from '../model/use-application-grid'
import ApplicationCard from '@/entities/create-application/ui/application-card'
import {
  ACCREDITATION_APPLICATION_CATEGORY,
  APPLICATION_CATEGORIES,
  ApplicationCategory,
  isCategoryClosed,
} from '@/entities/create-application'
import { useAuth } from '@/shared/hooks/use-auth'
import { UserRoles } from '@/shared/types/user'

const roleTabs = (role?: UserRoles) =>
  role == UserRoles.INDIVIDUAL
    ? [
        {
          id: ApplicationCategory.EQUIPMENTS,
          name: 'Xavfli obyektlar va qurilmalar',
        },
      ]
    : role == UserRoles.INSPECTOR
      ? [
          {
            id: ApplicationCategory.ILLEGAL_HF,
            name: 'XICHO',
          },
        ]
      : role == UserRoles.LEGAL
        ? [...APPLICATION_CATEGORIES, ACCREDITATION_APPLICATION_CATEGORY]
        : APPLICATION_CATEGORIES

export const ApplicationsGrid: React.FC = () => {
  const { user } = useAuth()
  const tabs = useMemo(() => roleTabs(user?.role).filter((tab) => !isCategoryClosed(tab.id)), [user?.role])
  const openTabs = useMemo(() => tabs.map((tab) => tab.id), [tabs])

  const { activeTab, mainCards, selectedMainCard, handleMainCardSelect, handleChangeTab, displayedSubCards } =
    useApplicationGrid(openTabs)

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
    const gridClasses = 'grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 gap-4 pb-4'

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

  if (tabs.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-slate-500">Ariza yuborish vaqtincha to‘xtatilgan</p>
      </div>
    )
  }

  return (
    <TabsLayout
      activeTab={activeTab ?? ''}
      defaultValue={activeTab ?? undefined}
      classNameTabList="px-4 py-6"
      tabs={tabs}
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

ApplicationsGrid.displayName = 'ApplicationsGrid'
