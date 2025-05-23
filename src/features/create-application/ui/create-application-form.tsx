import { toast } from 'sonner';
import { Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { getFormComponentByType, isValidApplicationType } from '../model/store';
import { AppealFormSkeleton, ApplicationModal } from '@/features/create-application';
import { ApplicationTypeEnum, useApplicationFactory } from '@/entities/create-application';

export const CreateApplicationForm = () => {
  const { type } = useParams<{ type: ApplicationTypeEnum }>();
  const {
    error,
    isLoading,
    documentUrl,
    isModalOpen,
    isPdfLoading,
    handleCloseModal,
    handleCreateApplication,
    submitApplicationMetaData,
  } = useApplicationFactory({
    applicationType: type!,
    onError: (error) => toast(error, { richColors: true }),
  });

  const handleFormSubmit = (data: any) => {
    handleCreateApplication(data);
  };

  if (!isValidApplicationType(type!)) {
    return (
      <div className="error-container">
        <h3>Noto'g'ri ariza turi</h3>
        <p>Ko'rsatilgan ariza turi ({type}) mavjud emas!</p>
      </div>
    );
  }

  const FormComponent = getFormComponentByType(type!);

  return (
    <Suspense fallback={<AppealFormSkeleton />}>
      {FormComponent && <FormComponent onSubmit={handleFormSubmit} />}
      <ApplicationModal
        error={error}
        isOpen={isModalOpen}
        isLoading={isLoading}
        documentUrl={documentUrl!}
        onClose={handleCloseModal}
        isPdfLoading={isPdfLoading}
        submitApplicationMetaData={submitApplicationMetaData}
      />
    </Suspense>
  );
};
