import { DocumentField } from '@/features/application/create-application/ui/forms/parts/equipment-fields'
import {
  ManufacturedAtField,
  PhoneNumberField,
  ServicePeriodField,
} from '@/features/application/create-application/ui/forms/parts/equipment-fields'
import { ApplicantSearchCard } from '@/features/application/create-application/ui/forms/parts/applicant-search-card'
import { CardForm, RegisterIllegalHeatPipelineDTO } from '@/entities/create-application'
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
import { useRegisterIllegalHeatPipeline } from '@/features/application/create-application/model/use-create-illegal-heat-pipeline-application'

interface RegisterIllegalHeatPipelineFormProps {
  onSubmit: (data: RegisterIllegalHeatPipelineDTO) => void
  isPending?: boolean
}

const RegisterIllegalHeatPipelineForm = ({ onSubmit, isPending = false }: RegisterIllegalHeatPipelineFormProps) => {
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
  } = useRegisterIllegalHeatPipeline(onSubmit)

  const identity = form.watch('identity')
  const isLegal = identity?.length === 9
  const isIndividual = identity?.length === 14

  if (isLoading) {
    return <AppealFormSkeleton />
  }

  return (
    <Form {...form}>
      <form autoComplete="off" onSubmit={form.handleSubmit(handleSubmit)}>
        <GoBack
          title={
            isUpdate ? 'Issiqlik tarmog‘i maʼlumotlarini tahrirlash' : 'Issiqlik tarmog‘ini ro‘yxatga olish arizasi'
          }
        />
        <NoteForm equipmentName="issiqlik tarmog‘i" />

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
                      <Select onValueChange={field.onChange} value={field.value || ''}>
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
                  <FormLabel required>Quvur turini tanlang</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        if (value) {
                          field.onChange(value)
                        }
                      }}
                      value={field.value}
                    >
                      <SelectTrigger className="3xl:w-sm w-full">
                        <SelectValue placeholder="Quvur turini tanlang" />
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
                  <FormLabel required>Quvurning zavod raqami</FormLabel>
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
                  <FormLabel required>Quvur egasining nomi</FormLabel>
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
                  {isUpdate && detail?.factoryNumber && /[\u0400-\u04FF]/.test(detail.factoryNumber) && (
                    <FormDescription className="3xl:w-sm w-full wrap-break-word">
                      Eski qiymat: {detail.factoryNumber}
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
                    <FormLabel required={!isUpdate}>Quvurning tashqi ko‘rikdan o‘tkazilgan sana</FormLabel>
                    <DatePicker
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
                    <FormLabel required={!isUpdate}>Quvurning gidravlik sinovdan o‘tkazilgan sana</FormLabel>
                    <DatePicker
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
              name="nonDestructiveCheckDate"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
                return (
                  <FormItem className="3xl:w-sm w-full">
                    <FormLabel required={!isUpdate}>Oxirgi o‘tkazilgan putur yetkazmaydigan nazorat sanasi</FormLabel>
                    <DatePicker
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
              name="diameter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Diametr, mm</FormLabel>
                  <FormControl>
                    <Input type="text" className="3xl:w-sm w-full" placeholder="Diametr, mm" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="thickness"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Devor qalinligi,mm</FormLabel>
                  <FormControl>
                    <Input type="text" className="3xl:w-sm w-full" placeholder="Devor qalinligi,mm" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="length"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Uzunligi,m</FormLabel>
                  <FormControl>
                    <Input type="text" className="3xl:w-sm w-full" placeholder="Uzunligi,m" {...field} />
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
                  <FormLabel required>Bosim,mPa</FormLabel>
                  <FormControl>
                    <Input type="text" className="3xl:w-sm w-full" placeholder="Bosim,mPa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="temperature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Harorat, °C</FormLabel>
                  <FormControl>
                    <Input type="text" className="3xl:w-sm w-full" placeholder="Harorat, °C" {...field} />
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
                  <FormLabel required>Quvur joylashgan viloyat</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        if (value) {
                          field.onChange(value)
                          form.setValue('districtId', '')
                        }
                      }}
                      value={field.value?.toString()}
                    >
                      <SelectTrigger className="3xl:w-sm w-full">
                        <SelectValue placeholder="Viloyatni tanlang" />
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
                  <FormLabel required>Quvur joylashgan tuman</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value?.toString()}
                      disabled={!form.watch('regionId')}
                    >
                      <SelectTrigger className="3xl:w-sm w-full">
                        <SelectValue placeholder="Tumanni tanlang" />
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
                  <FormLabel required>Quvurning joylashgan manzili</FormLabel>
                  <FormControl>
                    <Input className="3xl:w-sm w-full" placeholder="Aniq manzil" {...field} />
                  </FormControl>
                  {isUpdate && detail?.address && /[\u0400-\u04FF]/.test(detail.address) && (
                    <FormDescription className="3xl:w-sm w-full wrap-break-word">
                      Eski qiymat: {detail.address}
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="3xl:w-sm w-full">
                  <FormLabel required>Geolokatsiya (xaritadan joyni tanlang)</FormLabel>
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
                      Quvurning birkasi bilan sur‘ati
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
              label="Odli-sotdi shartnomasi (egalik huquqini beruvchi hujjat)"
              required={!isUpdate}
            />
          </div>

          <div className="border-b pb-4">
            <DocumentField
              form={form}
              name="equipmentCertPath"
              label="Quvur muvofiqlik sertifikati (muqaddam foydalanishda bo‘lgan bug‘qozon uchun majburiy emas)"
            />
          </div>

          <div className="border-b pb-4">
            <DocumentField
              form={form}
              name="assignmentDecreePath"
              label="Mas‘ul shaxs tayinlanganligi to‘g‘risida buyruq"
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
                    <FormLabel className="w-full sm:max-w-1/2 2xl:max-w-3/7">
                      Ekspertiza xulosasi (ishlash muddatini o‘tagan bo‘lsa majburiy)
                    </FormLabel>
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
                      <FormLabel required={!!form.watch('expertisePath')}>Amal qilish sanasi</FormLabel>
                      <DatePicker
                        className={'max-w-2/3'}
                        value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                        onChange={field.onChange}
                        disableStrategy={'before'}
                        placeholder="Sanani tanlang"
                        disabled={!form.watch('expertisePath')}
                      />
                    </div>
                  </FormItem>
                )
              }}
            />
          </div>

          <div className="border-b pb-4">
            <DocumentField form={form} name="installationCertPath" label="Montaj dalolatnomasi" required={!isUpdate} />
          </div>

          <div className="border-b pb-4">
            <DocumentField form={form} name="passportPath" label="Quvur pasporti" required={!isUpdate} />
          </div>

          <div className="border-b pb-4">
            <DocumentField
              form={form}
              name="fullCheckPath"
              label="Quvurning gidravlik sinovdan o‘tkazilganligi"
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

          <div className="border-b pb-4">
            <DocumentField
              form={form}
              name="partialCheckPath"
              label="Quvurning tashqi ko‘rikdan o‘tkazilganligi"
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
                      <FormLabel required={!isUpdate}>Navbatdagi tashqi ko‘rik sanasi</FormLabel>
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

export default RegisterIllegalHeatPipelineForm
