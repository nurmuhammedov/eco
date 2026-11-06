import { RegisterIllegalTankerDTO } from '@/entities/create-application'
import { GoBack } from '@/shared/components/common'
import { Button } from '@/shared/components/ui/button'
import { Form } from '@/shared/components/ui/form'
import { useRegisterIllegalTanker } from '../../model/use-create-illegal-tanker-application'
import { AppealFormSkeleton } from '../form-skeleton'
import { NoteForm } from '../note-form'
import { ApplicantSearchCard } from './parts/applicant-search-card'
import { TankerFields } from './parts/tanker-fields'

interface RegisterIllegalTankerFormProps {
  onSubmit: (data: RegisterIllegalTankerDTO) => void
  isPending?: boolean
}

/** `UnofficialTankerDto`, or an edit of a registered tanker (`UpdateTankerDto`) */
const RegisterIllegalTankerForm = ({ onSubmit, isPending = false }: RegisterIllegalTankerFormProps) => {
  const {
    form,
    isUpdate,
    childTypeOptions,
    districtOptions,
    regionOptions,
    hazardousFacilitiesOptions,
    ownerData,
    isLoading,
    isSearchLoading,
    isSubmitPending,
    handleSearch,
    handleClear,
    handleSubmit,
  } = useRegisterIllegalTanker(onSubmit)

  const identity = form.watch('identity')
  const isLegal = identity?.length === 9
  const isIndividual = identity?.length === 14

  if (isLoading) {
    return <AppealFormSkeleton />
  }

  return (
    <Form {...form}>
      <form autoComplete="off" onSubmit={form.handleSubmit(handleSubmit)}>
        <GoBack
          title={
            isUpdate ? 'Harakatlanuvchi sig‘im ma’lumotlarini tahrirlash' : 'Harakatlanuvchi sig‘imni ro‘yxatga olish'
          }
        />
        <NoteForm equipmentName="harakatlanuvchi sig‘im" />

        <ApplicantSearchCard
          form={form}
          isUpdate={isUpdate}
          isLegal={isLegal}
          isIndividual={isIndividual}
          ownerData={ownerData}
          isSearchLoading={isSearchLoading}
          onSearch={handleSearch}
          onClear={handleClear}
        />

        <TankerFields
          form={form}
          isUpdate={isUpdate}
          showPhone={!isUpdate}
          showHazardousFacility={isLegal}
          hazardousFacilitiesOptions={hazardousFacilitiesOptions}
          childTypeOptions={childTypeOptions}
          regionOptions={regionOptions}
          districtOptions={districtOptions}
        />

        <Button
          type="submit"
          disabled={!ownerData && !isUpdate}
          loading={isPending || isSubmitPending}
          className="mt-0"
        >
          {isUpdate ? 'Saqlash' : 'Ro‘yxatga olish'}
        </Button>
      </form>
    </Form>
  )
}

export default RegisterIllegalTankerForm
