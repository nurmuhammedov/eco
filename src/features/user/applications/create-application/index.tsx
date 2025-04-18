import { useState } from 'react';
import { GoBack } from '@/shared/components/common';
import { getSelectOptions } from '@/shared/lib/get-select-options.tsx';
import { DynamicApplicationForm } from './ui/dynamic-application-form';
import { ApplicantInfo } from '@/entities/user/applications/create-application/ui';
import { APPLICATIONS_TYPES } from '@/entities/user/applications/create-application/data';
import { useApplicationForm } from '@/features/user/applications/create-application/lib/use-application-form';
import { ApplicationTypeEnum } from '@/entities/user/applications/create-application/model/application.types';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/shared/components/ui/select';

const ApplicationForm = () => {
  const [applicationType, setApplicationType] = useState<ApplicationTypeEnum>(ApplicationTypeEnum.RegisterBoiler);

  const form = useApplicationForm(applicationType);

  const applicationTypeList = getSelectOptions(APPLICATIONS_TYPES);

  return (
    <div className="2xl:w-full 3xl:w-4/5">
      <Form {...form}>
        <GoBack title="Ариза яратиш" />
        <ApplicantInfo form={form} />
        <FormField
          control={form.control}
          name="application_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-base">Ариза тури</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setApplicationType(value as ApplicationTypeEnum);
                  }}
                  {...field}
                >
                  <SelectTrigger className="max-w-sm">
                    <SelectValue placeholder="Ариза тури" />
                  </SelectTrigger>
                  <SelectContent>{applicationTypeList}</SelectContent>
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
