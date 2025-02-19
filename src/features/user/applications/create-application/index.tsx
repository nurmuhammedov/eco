import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { ApplicationType } from '@/entities/user/applications/model/application.types';
import { DynamicApplicationForm } from '@/features/user/applications/create-application/ui/dynamic-application-form';

const ApplicationForm = () => {
  const [applicationType, setApplicationType] = useState<ApplicationType>(
    ApplicationType.RegisterHPO,
  );

  return (
    <div>
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
    </div>
  );
};
export default ApplicationForm;
