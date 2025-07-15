import { ApplicationModal } from '@/features/application/create-application';
import { Button } from '@/shared/components/ui/button.tsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog.tsx';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form.tsx';
import { QK_APPLICATIONS } from '@/shared/constants/query-keys.ts';
import { useEIMZO } from '@/shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { z } from 'zod';
import { AccreditationSphere } from '@/entities/accreditation/models/accreditation.enums.ts';
import { FORM_ERROR_MESSAGES } from '@/shared/validation';
import { format, parseISO } from 'date-fns';
import DatePicker from '@/shared/components/ui/datepicker.tsx';
import { MultiSelect } from '@/shared/components/ui/multi-select.tsx';
import { ACCREDITATION_SPHERE_OPTIONS } from '@/shared/constants/accreditation-data.ts';
import { useTranslation } from 'react-i18next';
import { Input } from '@/shared/components/ui/input.tsx';
import { InputFile } from '@/shared/components/common/file-upload';
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types.ts';
import { Textarea } from '@/shared/components/ui/textarea.tsx';
import { ArrowLeft } from 'lucide-react';
import { clsx } from 'clsx';

const schema = z.object({
  referencePath: z.string().min(1, FORM_ERROR_MESSAGES.required),
  certificateNumber: z.string().min(1, FORM_ERROR_MESSAGES.required),
  certificateValidityDate: z.date({ required_error: FORM_ERROR_MESSAGES.required }),
  certificateDate: z.date({ required_error: FORM_ERROR_MESSAGES.required }),
  assessmentCommissionDecisionPath: z.string().min(1, FORM_ERROR_MESSAGES.required),
  assessmentCommissionDecisionNumber: z.string().min(1, FORM_ERROR_MESSAGES.required),
  assessmentCommissionDecisionDate: z.date({ required_error: FORM_ERROR_MESSAGES.required }),
  accreditationCommissionDecisionPath: z.string().min(1, FORM_ERROR_MESSAGES.required),
  accreditationCertificatePath: z.string().min(1, FORM_ERROR_MESSAGES.required),
  accreditationCommissionDecisionNumber: z.string().min(1, FORM_ERROR_MESSAGES.required),
  accreditationCommissionDecisionDate: z.date({ required_error: FORM_ERROR_MESSAGES.required }),
  accreditationSpheres: z.array(z.nativeEnum(AccreditationSphere)).min(1, FORM_ERROR_MESSAGES.required),
});

const schema2 = z.object({
  rejectionReason: z.string(),
});

const ApplyAccreditationModal = () => {
  const { id } = useParams();

  const [isShow, setIsShow] = useState(false);
  const [modalType, setModalType] = useState<'certificate' | 'reject'>('certificate');
  const form2 = useForm<z.infer<typeof schema2>>({
    resolver: zodResolver(schema2),
  });

  function onSubmit2(data: z.infer<typeof schema2>) {
    handleCreateApplication({ ...data, appealId: id });
    setIsShow(false);
  }

  const { t } = useTranslation('accreditation');
  const accreditationSphereOptions = useMemo(() => {
    return ACCREDITATION_SPHERE_OPTIONS.map((option) => ({
      id: option.id,
      name: `${option.point} - ${option.name}`,
    }));
  }, []);

  const {
    error,
    isLoading,
    documentUrl,
    isModalOpen,
    isPdfLoading,
    handleCloseModal,
    handleCreateApplication,
    submitApplicationMetaData,
  } = useEIMZO({
    pdfEndpoint: `/accreditations/${modalType}/generate-pdf`,
    submitEndpoint: `/accreditations/${modalType}`,
    successMessage: 'SUCCESS!',
    queryKey: QK_APPLICATIONS,
  });
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  function onSubmit(data: z.infer<typeof schema>) {
    handleCreateApplication({
      ...data,
      appealId: id,
      assessmentCommissionDecisionDate: format(data.assessmentCommissionDecisionDate, 'yyyy-MM-dd'),
      certificateDate: format(data.certificateDate, 'yyyy-MM-dd'),
      certificateValidityDate: format(data.certificateValidityDate, 'yyyy-MM-dd'),
      accreditationCommissionDecisionDate: format(data.accreditationCommissionDecisionDate, 'yyyy-MM-dd'),
    });
    setIsShow(false);
  }

  return (
    <>
      <Dialog onOpenChange={setIsShow} open={isShow}>
        <DialogTrigger asChild>
          <Button>Ijro etish</Button>
        </DialogTrigger>
        <DialogContent
          className={clsx({
            'sm:max-w-screen-xl': modalType === 'certificate',
            'sm:max-w-[725px]': modalType === 'reject',
          })}
        >
          <DialogHeader>
            <DialogTitle className="text-[#4E75FF]">
              {modalType === 'certificate' ? 'Ijro etish' : 'Rad etish'}
            </DialogTitle>
          </DialogHeader>
          {modalType === 'certificate' && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-4 gap-2 mb-2">
                  <div>
                    <FormField
                      control={form.control}
                      name="certificateNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Akkreditatsiya attestati raqami</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="Akkreditatsiya attestati raqami" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      name="accreditationSpheres"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>{t('form.accreditationSpheres')}</FormLabel>
                          <FormControl>
                            <MultiSelect
                              {...field}
                              options={accreditationSphereOptions}
                              placeholder={t('select_accreditation_sphere')}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="certificateDate"
                      render={({ field }) => {
                        const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value;
                        return (
                          <FormItem className="w-full ">
                            <FormLabel required>Akkreditatsiya attestati sanasi</FormLabel>
                            <DatePicker
                              value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                              onChange={field.onChange}
                              placeholder="Akkreditatsiya attestati sanasi"
                            />
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="certificateValidityDate"
                      render={({ field }) => {
                        const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value;
                        return (
                          <FormItem className="w-full ">
                            <FormLabel required>Akkreditatsiya attestati muddati</FormLabel>
                            <DatePicker
                              value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                              onChange={field.onChange}
                              placeholder="Akkreditatsiya attestati muddati"
                            />
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  </div>
                </div>
                <hr />
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <FormField
                      name="referencePath"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required={true}>Ma’lumotnomani yuklash</FormLabel>
                          <FormControl>
                            <InputFile showPreview={true} form={form} name={field.name} accept={[FileTypes.PDF]} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <FormField
                      control={form.control}
                      name="assessmentCommissionDecisionNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Baholash komissiyasi qarori raqami</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="Baholash komissiyasi qarori raqami" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="assessmentCommissionDecisionDate"
                      render={({ field }) => {
                        const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value;
                        return (
                          <FormItem className="w-full ">
                            <FormLabel required>Baholash komissiyasi qarori sanasi</FormLabel>
                            <DatePicker
                              value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                              onChange={field.onChange}
                              placeholder="Baholash komissiyasi qarori sanasi"
                            />
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  </div>
                  <div>
                    <FormField
                      name="assessmentCommissionDecisionPath"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required={true}>Baholash komissiyasining qarorini yuklash</FormLabel>
                          <FormControl>
                            <InputFile showPreview={true} form={form} name={field.name} accept={[FileTypes.PDF]} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <FormField
                      control={form.control}
                      name="accreditationCommissionDecisionNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Akkreditatsiya komissiyasining qarori raqami</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="Akkreditatsiya komissiyasining qarori raqami" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="accreditationCommissionDecisionDate"
                      render={({ field }) => {
                        const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value;
                        return (
                          <FormItem className="w-full ">
                            <FormLabel required>Akkreditatsiya komissiyasining qarori sanasi</FormLabel>
                            <DatePicker
                              value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                              onChange={field.onChange}
                              placeholder="Akkreditatsiya komissiyasining qarori sanasi"
                            />
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  </div>
                  <div>
                    <FormField
                      name="accreditationCommissionDecisionPath"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required={true}>Akkreditatsiya komissiyasining qarorini yuklash</FormLabel>
                          <FormControl>
                            <InputFile showPreview={true} form={form} name={field.name} accept={[FileTypes.PDF]} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      name="accreditationCertificatePath"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required={true}>Akkreditatsiya attestati ilova fayli</FormLabel>
                          <FormControl>
                            <InputFile showPreview={true} form={form} name={field.name} accept={[FileTypes.PDF]} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 ">
                  <Button variant="success" type="submit">
                    Saqlash
                  </Button>
                  <Button type="button" onClick={() => setModalType('reject')} variant="destructive">
                    Rad etish
                  </Button>
                </div>
              </form>
            </Form>
          )}
          {modalType === 'reject' && (
            <Form {...form2}>
              <form onSubmit={form2.handleSubmit(onSubmit2)} className="space-y-4">
                <FormField
                  control={form2.control}
                  name="rejectionReason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Qaytarish sababi</FormLabel>
                      <FormControl>
                        <Textarea
                          className="resize-none"
                          rows={7}
                          placeholder="Qaytarish sababini kiriting"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-3 ">
                  <Button onClick={() => setModalType('certificate')} variant="outline">
                    <ArrowLeft />
                    Ijro etishga
                  </Button>
                  <Button variant="destructive" type="submit">
                    Arizani rad etish
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
      <ApplicationModal
        error={error}
        isOpen={isModalOpen}
        isLoading={isLoading}
        documentUrl={documentUrl!}
        onClose={() => {
          handleCloseModal();
          setIsShow(true);
        }}
        isPdfLoading={isPdfLoading}
        submitApplicationMetaData={submitApplicationMetaData}
      />
    </>
  );
};

export default ApplyAccreditationModal;
