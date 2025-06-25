import { ApplicationCardItem, ApplicationCategory, ApplicationTypeEnum } from '@/entities/create-application';
import ApplicationCard from '@/entities/create-application/ui/application-card';
import { GoBack } from '@/shared/components/common';

const accreditationCards: ApplicationCardItem[] = [
  {
    id: 1,
    title: "Ekspert tashkilotini akkreditatsiyadan o'tkazish",
    description: "Ekspert tashkilotini akkreditatsiyadan o'tkazish uchun ariza",
    category: ApplicationCategory.ACCREDITATION,
    type: ApplicationTypeEnum.DEFAULT,
    icon: 'expertOrgAccreditationIcon',
  },
  {
    id: 2,
    title: "Ekspert tashkilotini qayta akkreditatsiyadan o'tkazish",
    description: "Ekspert tashkilotini qayta akkreditatsiyadan o'tkazish uchun ariza",
    category: ApplicationCategory.ACCREDITATION,
    type: ApplicationTypeEnum.DEFAULT,
    icon: 'expertOrgAccreditationIcon',
  },
  {
    id: 3,
    title: 'Ekspert tashkilotining akkreditatsiya sohasini kengaytirish',
    description: 'Ekspert tashkilotining akkreditatsiya sohasini kengaytirish uchun ariza',
    category: ApplicationCategory.ACCREDITATION,
    type: ApplicationTypeEnum.DEFAULT,
    icon: 'expertOrgAccreditationIcon',
  },
];

export const AccreditationCreatePage = () => {
  const gridClasses = 'grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 gap-4 mt-4';

  return (
    <div className="p-4">
      <GoBack title="Akkreditatsiyaga ariza yaratish" />

      <div className={gridClasses}>
        {accreditationCards.map((application) => (
          <ApplicationCard key={application.id} application={application} />
        ))}
      </div>
    </div>
  );
};
