import { Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { AppealFormSkeleton } from '@/features/create-application/ui/form-skeleton';
import { getFormComponentByType, isValidApplicationType } from '@/features/create-application';
import { ApplicationTypeEnum } from '@/entities/user/applications/create-application/model/application.types';

export const CreateApplicationForm = () => {
  const { type } = useParams<{ type: ApplicationTypeEnum }>();
  if (!isValidApplicationType(type!)) {
    return (
      <div className="error-container">
        <h3>Noto‘g‘ri ariza turi</h3>
        <p>Ko‘rsatilgan ariza turi ({type}) mavjud emas!</p>
      </div>
    );
  }

  const FormComponent = getFormComponentByType(type!);

  return <Suspense fallback={<AppealFormSkeleton />}>{FormComponent && <FormComponent />}</Suspense>;
};
