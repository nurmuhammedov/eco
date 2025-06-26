import { getAccreditationFormByType } from '@/features/accreditation/create/lib/get-accreditation-form-by-type';
import { accreditationCards } from '@/features/accreditation/create/ui/accreditation-create-page';
import { GoBack } from '@/shared/components/common';
import { useParams } from 'react-router-dom';

const CreateAccreditationFormPage = () => {
  const { type } = useParams<{ type: string }>();

  const AccreditationForm = getAccreditationFormByType(type!);

  if (!AccreditationForm) {
    return null;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-5">
        <GoBack title={accreditationCards?.find((i) => i.type === type)?.title || ''} />
      </div>
      <AccreditationForm />
    </>
  );
};

export default CreateAccreditationFormPage;
