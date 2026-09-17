import { DocumentField } from '@/features/application/create-application/ui/forms/parts/equipment-fields'
import {
  ManufacturedAtField,
  PhoneNumberField,
  ServicePeriodField,
} from '@/features/application/create-application/ui/forms/parts/equipment-fields'
import { ApplicantSearchCard } from '@/features/application/create-application/ui/forms/parts/applicant-search-card'
import { CardForm, RegisterIllegalLpgContainerDTO } from '@/entities/create-application'
import { AppealFormSkeleton } from '../form-skeleton'
import { NoteForm } from '../note-form'
import { GoBack } from '@/shared/components/common'
import { InputFile } from '@/shared/components/common/file-upload'
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types'
import { YandexMapModal } from '@/shared/components/common/yandex-map-modal'
import { Button } from '@/shared/components/ui/button'
import DatePicker from '@/shared/components/ui/datepicker'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { parseISO } from 'date-fns'
import { useRegisterIllegalLpgContainer } from '@/features/application/create-application/model/use-create-illegal-lpg-container-application'

interface RegisterIllegalLpgContainerFormProps {
  onSubmit: (data: RegisterIllegalLpgContainerDTO) => void
  isPending?: boolean
}

const RegisterIllegalLpgContainerForm = ({ onSubmit, isPending = false }: RegisterIllegalLpgContainerFormProps) => {
  const {
    form,
    isUpdate,
    childEquipmentOptions,
    districtOptions,
    regionOptions,
    hazardousFacilitiesOptions,
    ownerData,
    detail,
    isLoading,
    isSearchLoading,
    isSubmitPending,
    handleSearch,
    handleClear,
    handleSubmit,
  } = useRegisterIllegalLpgContainer(onSubmit)

  const identity = form.watch('identity')
  const isLegal = identity?.length === 9
  const isIndividual = identity?.length === 14

  if (isLoading) {
    return <AppealFormSkeleton />
  }

  return (
    <Form {...form}>
      <form autoComplete="off" onSubmit={form.handleSubmit(handleSubmit)}>
        <GoBack title={isUpdate ? 'Idish (SUG) maʼlumotlarini tahrirlash' : 'Idish (SUG)ni ro‘yxatga olish arizasi'} />
        <NoteForm equipmentName="idish (SUG)" />

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

        <CardForm className="mb-2">
          <div className="3xl:flex 3xl:flex-wrap 4xl:w-5/5 mb-5 grid gap-x-4 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
            {!isUpdate && <PhoneNumberField form={form} />}

            {isLegal && (
              <FormField
                control={form.control}
                name="hazardousFacilityId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>XICHO tanlang</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(val) => {
                          if (val) {
                            field.onChange(val)
                          }
                        }}
                        value={field.value || ''}
                      >
                        <SelectTrigger className="3xl:w-sm w-full">
                          <SelectValue placeholder="XICHOni tanlang (ixtiyoriy)" />
                        </SelectTrigger>
                        <SelectContent>{hazardousFacilitiesOptions}</SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="childEquipmentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Idish (SUG) turini tanlang</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(val) => {
                        if (val) {
                          field.onChange(val)
                        }
                      }}
                      value={field.value}
                    >
                      <SelectTrigger className="3xl:w-sm w-full">
                        <SelectValue placeholder="Idish (SUG) turini tanlang" />
                      </SelectTrigger>
                      <SelectContent>{childEquipmentOptions}</SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="factoryNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Idishning (SUG) zavod raqami</FormLabel>
                  <FormControl>
                    <Input className="3xl:w-sm w-full" placeholder="Qurilmaning zavod raqami" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="factory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Idishning (SUG) egasining nomi</FormLabel>
                  <FormControl>
                    <Input className="3xl:w-sm w-full" placeholder="Tayyorlovchi korxona nomi" {...field} />
                  </FormControl>
                  {isUpdate && detail?.factory && /[\u0400-\u04FF]/.test(detail.factory) && (
                    <FormDescription className="3xl:w-sm w-full wrap-break-word">
                      Eski qiymat: {detail.factory}
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Model, marka</FormLabel>
                  <FormControl>
                    <Input className="3xl:w-sm w-full" placeholder="Zavod raqami" {...field} />
                  </FormControl>
                  {isUpdate && detail?.model && /[\u0400-\u04FF]/.test(detail.model) && (
                    <FormDescription className="3xl:w-sm w-full wrap-break-word">
                      Eski qiymat: {detail.model}
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <ManufacturedAtField form={form} />
            <FormField
              control={form.control}
              name="partialCheckDate"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
                return (
                  <FormItem className="3xl:w-sm w-full">
                    <FormLabel required={!isUpdate}>Tashqi va ichki ko‘rik o‘tkazilgan sana</FormLabel>
                    <DatePicker
                      disableStrategy={'after'}
                      value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                      onChange={field.onChange}
                      placeholder="Sanani tanlang"
                    />
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            <FormField
              control={form.control}
              name="fullCheckDate"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
                return (
                  <FormItem className="3xl:w-sm w-full">
                    <FormLabel required={!isUpdate}>Gidravlik sinov o‘tkazilgan sana</FormLabel>
                    <DatePicker
                      disableStrategy={'after'}
                      value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                      onChange={field.onChange}
                      placeholder="Sanani tanlang"
                    />
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            <FormField
              control={form.control}
              name="nonDestructiveCheckDate"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
                return (
                  <FormItem className="3xl:w-sm w-full">
                    <FormLabel required={!isUpdate}>Oxirgi o‘tkazilgan putur yetkazmaydigan nazorat sanasi</FormLabel>
                    <DatePicker
                      disableStrategy={'after'}
                      value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                      onChange={field.onChange}
                      placeholder="Sanani tanlang"
                    />
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            <ServicePeriodField form={form} />
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Hajmi</FormLabel>
                  <FormControl>
                    <Input type="text" className="3xl:w-sm w-full" placeholder="Hajmi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="environment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Muhit</FormLabel>
                  <FormControl>
                    <Input type="text" className="3xl:w-sm w-full" placeholder="Muhit" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pressure"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Bosim, MPa</FormLabel>
                  <FormControl>
                    <Input type="text" className="3xl:w-sm w-full" placeholder="Bosim, MPa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="regionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Idish (SUG) joylashgan viloyat</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(val) => {
                        if (val) {
                          field.onChange(val)
                          form.setValue('districtId', '')
                        }
                      }}
                      value={field.value?.toString()}
                    >
                      <SelectTrigger className="3xl:w-sm w-full">
                        <SelectValue placeholder="Qurilma joylashgan viloyat" />
                      </SelectTrigger>
                      <SelectContent>{regionOptions}</SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="districtId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Idish (SUG) joylashgan tuman</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(val) => {
                        if (val) {
                          field.onChange(val)
                        }
                      }}
                      value={field.value?.toString()}
                      disabled={!form.watch('regionId')}
                    >
                      <SelectTrigger className="3xl:w-sm w-full">
                        <SelectValue placeholder="Qurilma joylashgan tuman" />
                      </SelectTrigger>
                      <SelectContent>{districtOptions}</SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Idishning (SUG) joylashgan manzili</FormLabel>
                  <FormControl>
                    <Input className="3xl:w-sm w-full" placeholder="Qurilmaning joylashgan manzili" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="3xl:w-sm w-full">
                  <FormLabel required>Geolokatsiya (xaritadan joyni tanlang va koordinatalarni kiriting)</FormLabel>
                  <FormControl>
                    <YandexMapModal
                      initialCoords={field.value ? field.value.split(',').map(Number) : null}
                      onConfirm={(coords) => field.onChange(coords)}
                      label="Xaritadan belgilash"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardForm>

        <CardForm className="mb-5 grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2 2xl:grid-cols-3">
          <div className="border-b pb-4">
            <DocumentField form={form} name="usageRightsPath" label="Ruxsatnoma" />
          </div>

          <div className="border-b pb-4">
            <FormField
              name="labelPath"
              control={form.control}
              render={({ field }) => (
                <FormItem className={'mb-2'}>
                  <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                    <FormLabel required={!isUpdate} className="w-full sm:max-w-1/2 2xl:max-w-3/7">
                      Idishning (SUG) birkasi bilan surʼati
                    </FormLabel>
                    <FormControl>
                      <InputFile form={form} name={field.name} accept={[FileTypes.IMAGE, FileTypes.PDF]} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <div className="border-b pb-4">
            <DocumentField
              form={form}
              name="saleContractPath"
              label="Qurilmaning oldi sotdi shartnomasi"
              required={!isUpdate}
            />
          </div>

          <div className="border-b pb-4">
            <DocumentField form={form} name="equipmentCertPath" label="Idish (SUG) sertifikati fayli" />
          </div>

          <div className="border-b pb-4">
            <DocumentField
              form={form}
              name="assignmentDecreePath"
              label="Mas‘ul shaxs tayinlanganligi to‘g‘risida buyruq fayli"
              required={!isUpdate}
            />
          </div>

          <div className="border-b pb-4">
            <FormField
              name="expertisePath"
              control={form.control}
              render={({ field }) => (
                <FormItem className={'mb-2'}>
                  <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                    <FormLabel className="w-full sm:max-w-1/2 2xl:max-w-3/7">Ekspertiza loyihasi fayli</FormLabel>
                    <FormControl>
                      <InputFile
                        form={form}
                        name={field.name}
                        accept={[FileTypes.PDF]}
                        onRemove={() =>
                          form.setValue('expertiseExpiryDate', undefined as any, { shouldValidate: true })
                        }
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expertiseExpiryDate"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
                return (
                  <FormItem className="w-full">
                    <div className="mb-2 flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                      <FormLabel required={!!form.watch('expertisePath')}>Amal qilish muddati</FormLabel>
                      <DatePicker
                        className={'max-w-2/3'}
                        value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                        onChange={field.onChange}
                        disableStrategy={'before'}
                        placeholder="Sanani tanlang"
                        disabled={!form.watch('expertisePath')}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
          </div>

          <div className="border-b pb-4">
            <DocumentField form={form} name="installationCertPath" label="Montaj guvohnomasi fayli" />
          </div>

          <div className="border-b pb-4">
            <DocumentField
              form={form}
              name="passportPath"
              label="Bosim ostida ishlovchi idish pasporti"
              required={!isUpdate}
            />
          </div>

          <div className="border-b pb-4">
            <DocumentField
              form={form}
              name="partialCheckPath"
              label="Idishning tashqi va ichki ko‘rikdan o‘tkazilganligi"
              required={!isUpdate}
            />
            <FormField
              control={form.control}
              name="nextPartialCheckDate"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
                return (
                  <FormItem className="w-full">
                    <div className="mb-2 flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                      <FormLabel required={!isUpdate}>Navbatdagi tashqi va ichki ko‘rik sanasi</FormLabel>
                      <DatePicker
                        className={'max-w-2/3'}
                        value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                        onChange={field.onChange}
                        disableStrategy={isUpdate ? undefined : 'before'}
                        placeholder="Sanani tanlang"
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
          </div>

          <div className="border-b pb-4">
            <DocumentField
              form={form}
              name="fullCheckPath"
              label="Idishning gidravlik sinovdan o‘tkazilganligi"
              required={!isUpdate}
            />
            <FormField
              control={form.control}
              name="nextFullCheckDate"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
                return (
                  <FormItem className="w-full">
                    <div className="mb-2 flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                      <FormLabel required={!isUpdate}>Navbatdagi gidravlik sinov sanasi</FormLabel>
                      <DatePicker
                        className={'max-w-2/3'}
                        value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                        onChange={field.onChange}
                        disableStrategy={isUpdate ? undefined : 'before'}
                        placeholder="Sanani tanlang"
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
          </div>
        </CardForm>

        <Button
          type="submit"
          disabled={!ownerData && !isUpdate}
          loading={isPending || isSubmitPending}
          className="mt-0"
        >
          {isUpdate ? 'Saqlash' : 'Ariza yaratish'}
        </Button>
      </form>
    </Form>
  )
}

export default RegisterIllegalLpgContainerForm
