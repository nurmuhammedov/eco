import { ApplicationTypeEnum, getApplicationAccess, useApplicationFactory } from '@/entities/create-application'
import { AppealFormSkeleton, ApplicationModal } from '@/features/application/create-application'
import { Suspense } from 'react'
import { useParams } from 'react-router-dom'
import { getFormComponentByType, isValidApplicationType } from '../model/store'
import { GoBack } from '@/shared/components/common'
import { useAuth } from '@/shared/hooks/use-auth'

export const CreateApplicationForm = ({ type: propsType }: { type?: ApplicationTypeEnum }) => {
  const { type: paramsType } = useParams<{ type: ApplicationTypeEnum }>()
  const type = propsType || paramsType
  const { user } = useAuth()

  // The type comes from the URL, so the role is checked here as well
  const access = getApplicationAccess(type!, user?.role)

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

  if (access === 'disabled') {
    return (
      <div className="error-container">
        <GoBack title={'Ushbu ariza turi vaqtincha mavjud emas!'} />
      </div>
    )
  }

  if (access === 'forbidden') {
    return (
      <div className="error-container">
        <GoBack title={'Ushbu arizani yuborishga ruxsatingiz yo‘q!'} />
      </div>
    )
  }

  const FormComponent = getFormComponentByType(type!)

  return (
    <Suspense fallback={<AppealFormSkeleton />}>
      <div className="pb-4">{FormComponent && <FormComponent onSubmit={handleFormSubmit} />}</div>
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
