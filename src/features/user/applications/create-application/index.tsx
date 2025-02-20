import { useState } from 'react';
import { GoBack } from '@/shared/components/common';
import { DynamicApplicationForm } from './ui/dynamic-application-form';
import { ApplicantInfo } from '@/entities/user/applications/ui/applicant-info';
import { ApplicationType } from '@/entities/user/applications/model/application.types';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { APPLICATIONS_TYPES } from '@/entities/user/applications/data';
import { useApplicationForm } from '@/features/user/applications/create-application/models/useApplicationForm';

const ApplicationForm = () => {
  const [applicationType, setApplicationType] = useState<ApplicationType>(
    ApplicationType.RegisterHPO,
  );

  const form = useApplicationForm(applicationType);

  return (
    <div className="2xl:w-5/6 3xl:w-4/5">
      <Form {...form}>
        <GoBack title="Ариза яратиш" />
        <ApplicantInfo form={form} />
        <FormField
          control={form.control}
          name="application_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-base">
                Ариза тури
              </FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) =>
                    setApplicationType(value as ApplicationType)
                  }
                  {...field}
                >
                  <SelectTrigger className="max-w-sm">
                    <SelectValue placeholder="Ариза тури" />
                  </SelectTrigger>
                  <SelectContent>
                    {APPLICATIONS_TYPES.map((type) => (
                      <SelectItem value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DynamicApplicationForm applicationType={applicationType} form={form} />
      </Form>
    </div>
  );
};
export default ApplicationForm;
