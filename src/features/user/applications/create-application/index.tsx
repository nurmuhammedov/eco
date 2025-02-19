import { useState } from 'react';
import { GoBack } from '@/shared/components/common';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { DynamicApplicationForm } from './ui/dynamic-application-form';
import { ApplicationType } from '@/entities/user/applications/model/application.types';
import { Form } from '@/shared/components/ui/form';
import { useApplicationForm } from '@/features/user/applications/create-application/models/useApplicationForm.ts';
import { ApplicantInfo } from '@/entities/user/applications/ui/applicant-info.tsx';

const ApplicationForm = () => {
  const [applicationType, setApplicationType] = useState<ApplicationType>(
    ApplicationType.RegisterHPO,
  );

  const form = useApplicationForm(applicationType);

  return (
    <Form {...form}>
      <GoBack title="Ариза яратиш" />
      <ApplicantInfo form={form} />
      <Select
        onValueChange={(value) => setApplicationType(value as ApplicationType)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(ApplicationType).map((type) => (
            <SelectItem value={type}>{type}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <DynamicApplicationForm applicationType={applicationType} />
    </Form>
  );
};
export default ApplicationForm;
