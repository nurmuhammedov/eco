import { AddDeclaration } from '@/features/declarations/ui/add-declaration'
import { GoBack } from '@/shared/components/common'

const AddDeclarationPage = () => {
  return (
    <div>
      <GoBack title="Deklaratsiya qo‘shish" />
      <AddDeclaration />
    </div>
  )
}

export default AddDeclarationPage
