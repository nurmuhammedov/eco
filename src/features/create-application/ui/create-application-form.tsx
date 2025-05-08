import { ApplicationTypeEnum, useApplicationFactory } from '@/entities/create-application';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { getFormComponentByType, isValidApplicationType } from '../model/store';
import { Suspense } from 'react';
import { AppealFormSkeleton, ApplicationModal } from '@/features/create-application';

export const CreateApplicationForm = () => {
  const navigate = useNavigate();
  const { type } = useParams<{ type: ApplicationTypeEnum }>();
  const {
    isModalOpen,
    isLoading,
    isPdfLoading,
    isSignLoading,
    isSubmitLoading,
    currentStep,
    error,
    documentUrl,
    handleCreateApplication,
    handleSignDocument,
    handleSubmitApplication,
    handleEditForm,
    handleCloseModal,
    handleDownloadDocument,
  } = useApplicationFactory({
    applicationType: type!,
    onSuccess: () => {
      toast('Ariza muvaffaqiyatli yuborildi');

      setTimeout(() => {
        navigate('/applications');
      }, 1000);
    },
    onError: (error) => {
      toast(error, { richColors: true });
    },
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
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        documentUrl={documentUrl}
        currentStep={currentStep}
        isLoading={isLoading}
        isPdfLoading={isPdfLoading}
        isSignLoading={isSignLoading}
        isSubmitLoading={isSubmitLoading}
        error={error}
        onEditForm={handleEditForm}
        onSignDocument={handleSignDocument}
        onSubmitApplication={handleSubmitApplication}
        onDownloadDocument={handleDownloadDocument}
      />
    </Suspense>
  );
};
