import { CreateTankerApplicationDTO } from '@/entities/create-application'
import { UserRoles } from '@/shared/types/user'
import { GoBack } from '@/shared/components/common'
import { Button } from '@/shared/components/ui/button'
import { Form } from '@/shared/components/ui/form'
import { useAuth } from '@/shared/hooks/use-auth'
import { NoteForm } from '../note-form'
import { useCreateTankerApplication } from '../../model/use-create-tanker-application'
import { TankerFields } from './parts/tanker-fields'

interface RegisterTankerFormProps {
  onSubmit: (data: CreateTankerApplicationDTO) => void
}

/** `TankerDto`: an organization or citizen applies to register its tanker */
const RegisterTankerForm = ({ onSubmit }: RegisterTankerFormProps) => {
  const { form, regionOptions, districtOptions, childTypeOptions, hazardousFacilitiesOptions } =
    useCreateTankerApplication()
  const { user } = useAuth()

  return (
    <Form {...form}>
      <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)}>
        <GoBack title="Harakatlanuvchi sig‘imni ro‘yxatga olish" />
        <NoteForm equipmentName="harakatlanuvchi sig‘im" />
        <TankerFields
          form={form}
          showPhone
          showHazardousFacility={user?.role !== UserRoles.INDIVIDUAL}
          hazardousFacilitiesOptions={hazardousFacilitiesOptions}
          childTypeOptions={childTypeOptions}
          regionOptions={regionOptions}
          districtOptions={districtOptions}
        />
        <Button type="submit" className="mt-0">
          Ariza yaratish
        </Button>
      </form>
    </Form>
  )
}

export default RegisterTankerForm
