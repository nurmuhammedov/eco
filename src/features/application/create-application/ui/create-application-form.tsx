import { ApplicationTypeEnum, useApplicationFactory } from '@/entities/create-application'
import { AppealFormSkeleton, ApplicationModal } from '@/features/application/create-application'
import { Suspense } from 'react'
import { useParams } from 'react-router-dom'
import { getFormComponentByType, isValidApplicationType } from '../model/store'
import { GoBack } from '@/shared/components/common'

export const CreateApplicationForm = () => {
  const { type } = useParams<{ type: ApplicationTypeEnum }>()
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
  })

  const handleFormSubmit = (data: any) => {
    handleCreateApplication(data)
  }

  if (!isValidApplicationType(type!)) {
    return (
      <div className="error-container">
        <GoBack title={'Ushbu ariza turi mavjud emas!'} />
      </div>
    )
  }

  const FormComponent = getFormComponentByType(type!)

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
  )
}
