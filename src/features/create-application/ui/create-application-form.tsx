import { useParams } from 'react-router-dom';
import { getFormComponentByType, isValidApplicationType } from '@/features/create-application';
import { ApplicationTypeEnum } from '@/entities/user/applications/create-application/model/application.types.ts';
import { Suspense } from 'react';

export const CreateApplicationForm = () => {
  const { type } = useParams<{ type: ApplicationTypeEnum }>();
  if (!isValidApplicationType(type!)) {
    return (
      <div className="error-container">
        <h3>Нотўғри ариза тури</h3>
        <p>Кўрсатилган ариза тури ({type}) мавжуд эмас.</p>
      </div>
    );
  }

  const FormComponent = getFormComponentByType(type!);

  return <Suspense fallback="Forma yuklanmoqda...">{FormComponent && <FormComponent />}</Suspense>;
};
