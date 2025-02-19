import { Form } from '@/shared/components/ui/form';
import { GoBack } from '@/shared/components/common';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { ApplicantInfo } from '@/entities/user/applications/ui/applicant-info';
import {
  ApplicationType,
  CreateRegisterHpoDTO,
} from '@/entities/user/applications/model/application.types';
import { useApplicationForm } from '@/features/user/applications/create-application/models/useApplicationForm';

export const RegisterHPOForm = () => {
  const form = useApplicationForm(ApplicationType.RegisterHPO);

  const onSubmit = (data: CreateRegisterHpoDTO) =>
    console.log("Yuborilgan ma'lumot:", data);
  return (
    <Form {...form}>
      <GoBack title="Ариза яратиш" />
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <ApplicantInfo form={form} />
        <Input {...form.register('name')} placeholder="Kompaniya kodi" />
        <Button type="submit">Ариза яратиш</Button>
      </form>
    </Form>
  );
};
