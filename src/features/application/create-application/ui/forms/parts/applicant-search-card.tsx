import { parseISO } from 'date-fns'
import { UseFormReturn } from 'react-hook-form'
import { CardForm } from '@/entities/create-application'
import DetailRow from '@/shared/components/common/detail-row'
import { Button } from '@/shared/components/ui/button'
import DatePicker from '@/shared/components/ui/datepicker'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'

interface ApplicantSearchCardProps {
  form: UseFormReturn<any>
  isUpdate: boolean
  isLegal: boolean
  isIndividual: boolean
  ownerData: any
  isSearchLoading: boolean
  onSearch: () => void
  onClear: () => void
}

/**
 * Who the application is for: a taxpayer or citizen number is typed, looked up,
 * and the record that comes back is shown. Every registration form opens with
 * it, and each used to carry its own copy - by the time this was pulled out the
 * copies had drifted apart, so a fix to one never reached the others.
 */
export const ApplicantSearchCard = ({
  form,
  isUpdate,
  isLegal,
  isIndividual,
  ownerData,
  isSearchLoading,
  onSearch,
  onClear,
}: ApplicantSearchCardProps) => {
  const identity = form.watch('identity')
  const birthDateString = form.watch('birthDate')

  return (
    <CardForm className="my-2">
      {!isUpdate ? (
        <div className="3xl:flex 3xl:flex-wrap 4xl:w-4/5 mb-5 grid gap-x-4 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
          <FormField
            control={form.control}
            name="identity"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>STIR yoki JSHSHIR</FormLabel>
                <FormControl>
                  <Input
                    disabled={!!ownerData}
                    className="3xl:w-sm w-full"
                    placeholder="STIR yoki JSHSHIRni kiriting"
                    maxLength={14}
                    {...field}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '')
                      e.target.value = val
                      if (ownerData) onClear()
                      if (val.length !== 14) {
                        form.setValue('birthDate', undefined as any)
                      }
                      field.onChange(e)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {isIndividual && (
            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
                return (
                  <FormItem className="3xl:w-sm w-full">
                    <FormLabel required>Tug‘ilgan sana</FormLabel>
                    <DatePicker
                      disabled={!!ownerData}
                      className="3xl:w-sm w-full"
                      value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                      onChange={field.onChange}
                      placeholder="Sanani tanlang"
                      disableStrategy="after"
                    />
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
          )}

          <div className="3xl:w-sm flex w-full items-end justify-start gap-2">
            {!ownerData ? (
              <Button
                type="button"
                onClick={onSearch}
                disabled={isSearchLoading || !identity || (!isLegal && !(isIndividual && birthDateString))}
                loading={isSearchLoading}
              >
                Qidirish
              </Button>
            ) : (
              <Button type="button" variant="destructive" onClick={onClear}>
                O‘chirish
              </Button>
            )}
          </div>
        </div>
      ) : null}

      {ownerData && (
        <div className={`${!isUpdate ? 'mt-4 border-t pt-4' : ''}`}>
          <h3 className="mb-4 text-base font-semibold text-gray-800">
            {isLegal ? 'Tashkilot ma’lumotlari' : 'Fuqaro ma’lumotlari'}
          </h3>
          <div className="grid grid-cols-1 gap-x-2 gap-y-2 md:grid-cols-1">
            <DetailRow
              title={isLegal ? 'Tashkilot nomi:' : 'F.I.SH.:'}
              value={
                isLegal ? ownerData?.name || ownerData?.legalName || '-' : ownerData?.fullName || ownerData?.name || '-'
              }
            />
            {isLegal && (
              <>
                <DetailRow title="Tashkilot rahbari:" value={ownerData?.directorName || ownerData?.fullName || '-'} />
                <DetailRow title="Manzil:" value={ownerData?.address || ownerData?.legalAddress || '-'} />
                <DetailRow title="Telefon raqami:" value={ownerData?.phoneNumber || '-'} />
              </>
            )}
          </div>
        </div>
      )}
    </CardForm>
  )
}
