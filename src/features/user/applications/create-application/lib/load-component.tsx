import { lazy } from 'react';
import { CardForm } from '@/entities/user/applications/ui';
import { useApplicationTypeMap } from './use-application-type-map';
import { APPLICATIONS_TYPES } from '@/entities/user/applications/data';
import { ApplicationTypeEnum } from '@/entities/user/applications/model/application.types';

export const loadComponent = (type: ApplicationTypeEnum) => {
  const applicationTypeMap = useApplicationTypeMap();

  if (!(type in applicationTypeMap)) {
    console.error(`❌ Noto‘g‘ri applicationType: ${type}`);
    return () => (
      <CardForm className="flex items-center justify-center h-96 mt-3">
        <p className="text-red-500">
          {APPLICATIONS_TYPES.find((obj) => obj.value === type)?.label ||
            "Noma'lum"}
          &nbsp;ariza turi topilmadi!
        </p>
      </CardForm>
    );
  }

  return lazy(() =>
    applicationTypeMap[type]()
      .then((module) => ({ default: module.default }))
      .catch((error) => {
        console.error(`❌ Component yuklanmadi: ${type}`, error);
        return {
          default: () => (
            <CardForm className="flex items-center justify-center h-96 mt-3">
              <p className="text-red-500">
                Ariza yuklanishda xatolik yuz berdi!
              </p>
            </CardForm>
          ),
        };
      }),
  );
};
