import {GoBack} from '@/shared/components/common';
import {Input} from '@/shared/components/ui/input';
import {Button} from '@/shared/components/ui/button';
import {NoteForm} from '@/features/create-application';
import {YandexMapModal} from '@/shared/components/common/yandex-map-modal';
import {InputFile} from '@/shared/components/common/file-upload/ui/file-upload';
import {CardForm} from '@/entities/create-application/ui/application-form-card';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/shared/components/ui/form';
import {Select, SelectContent, SelectTrigger, SelectValue} from '@/shared/components/ui/select';
import DatePicker from '@/shared/components/ui/datepicker.tsx';
import {useCreateLiftApplication} from "@/features/create-application/model/use-create-lift-application.ts";

export default () => {
    const {form, handleSubmit, regionOptions, districtOptions, childEquipmentOptions} = useCreateLiftApplication();

    return (
        <Form {...form}>
            <form autoComplete="off" onSubmit={form.handleSubmit(handleSubmit)}>
                <GoBack title="Liftni ro'yxatga olish"/>
                <NoteForm equipmentName="lift"/>
                <CardForm className="mb-2">
                    <div
                        className="md:grid md:grid-cols-2 xl:grid-cols-3 3xl:flex 3xl:flex-wrap gap-x-4 gap-y-5 4xl:w-5/5 mb-5">
                        <FormField
                            control={form.control}
                            name="childEquipmentId"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Lift turini tanlang</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} {...field}>
                                            <SelectTrigger className="w-full 3xl:w-sm">
                                                <SelectValue placeholder="Lift turini tanlang"/>
                                            </SelectTrigger>
                                            <SelectContent>{childEquipmentOptions}</SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="factoryNumber"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Liftning zavod raqami</FormLabel>
                                    <FormControl>
                                        <Input className="w-full 3xl:w-sm"
                                               placeholder="Liftning zavod raqami" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="factory"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Ishlab chiqargan zavod nomi</FormLabel>
                                    <FormControl>
                                        <Input className="w-full 3xl:w-sm"
                                               placeholder="Ishlab chiqargan zavod nomi" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="model"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Model, marka</FormLabel>
                                    <FormControl>
                                        <Input className="w-full 3xl:w-sm" placeholder="Model, marka" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="manufacturedAt"
                            render={({field}) => (
                                <FormItem className="w-full 3xl:w-sm">
                                    <FormLabel>Ishlab chiqarilgan sana</FormLabel>
                                    <DatePicker value={field.value} onChange={field.onChange}
                                                placeholder="Ishlab chiqarilgan sana"/>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="regionId"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Lift joylashgan viloyat</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={(value) => {
                                                if (value) {
                                                    field.onChange(value);
                                                    form.setValue('districtId', '');
                                                }
                                            }}
                                            value={field.value}
                                        >
                                            <SelectTrigger className="w-full 3xl:w-sm">
                                                <SelectValue placeholder="Lift joylashgan viloyat"/>
                                            </SelectTrigger>
                                            <SelectContent>{regionOptions}</SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="districtId"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Lift joylashgan tuman</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className="w-full 3xl:w-sm">
                                                <SelectValue placeholder="Lift joylashgan tuman"/>
                                            </SelectTrigger>
                                            <SelectContent>{districtOptions}</SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="address"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Lift joylashgan manzil</FormLabel>
                                    <FormControl>
                                        <Input className="w-full 3xl:w-sm"
                                               placeholder="Lift joylashgan manzil" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="location"
                            render={({field}) => (
                                <FormItem className="w-full 3xl:w-sm">
                                    <FormLabel>Joylashuv</FormLabel>
                                    <FormControl>
                                        <YandexMapModal
                                            initialCoords={field.value}
                                            onConfirm={(coords) => field.onChange(coords)}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <div
                            className="md:grid md:grid-cols-2 xl:grid-cols-3 3xl:flex 3xl:flex-wrap gap-x-4 gap-y-5 4xl:w-5/5 mb-5">
                            <FormField
                                control={form.control}
                                name="partialCheckDate"
                                render={({field}) => (
                                    <FormItem className="w-full 3xl:w-sm">
                                        <FormLabel required>Qisman texnik ko'rik sanasi</FormLabel>
                                        <DatePicker value={field.value} onChange={field.onChange}
                                                    placeholder="Qisman texnik ko'rik sanasi"/>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="fullCheckDate"
                                render={({field}) => (
                                    <FormItem className="w-full 3xl:w-sm">
                                        <FormLabel required>To'liq texnik ko'rik sanasi</FormLabel>
                                        <DatePicker value={field.value} onChange={field.onChange}
                                                    placeholder="To'liq texnik ko'rik sanasi"/>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="liftingCapacity"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Yuk ko'tara olish</FormLabel>
                                        <FormControl>
                                            <Input className="w-full 3xl:w-sm"
                                                   placeholder="Yuk ko'tara olish" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="stopCount"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>To'xtashlar soni</FormLabel>
                                        <FormControl>
                                            <Input
                                                min={1}
                                                type="number"
                                                className="w-full 3xl:w-sm"
                                                placeholder="To'xtashlar soni"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="labelPath"
                                control={form.control}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Liftning birkasi bilan sur'ati</FormLabel>
                                        <FormControl>
                                            <InputFile className="w-full 3xl:w-sm" form={form} {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </CardForm>
                <CardForm className="grid grid-cols-2 2xl:grid-cols-3 gap-x-16 gap-y-6">
                    <FormField
                        name="saleContractPath"
                        control={form.control}
                        render={({field}) => (
                            <FormItem className="pb-4 border-b">
                                <div className="flex items-end xl:items-center justify-between gap-2">
                                    <FormLabel className="max-w-1/2 2xl:max-w-3/7">Sotib olish-sotish shartnomasi
                                        fayli</FormLabel>
                                    <FormControl>
                                        <InputFile form={form} {...field} />
                                    </FormControl>
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="equipmentCertPath"
                        render={({field}) => (
                            <FormItem className="pb-4 border-b">
                                <div className="flex items-end xl:items-center justify-between gap-2">
                                    <FormLabel className="max-w-1/2 2xl:max-w-3/7">Qurilma sertifikati fayli</FormLabel>
                                    <FormControl>
                                        <InputFile form={form} {...field} />
                                    </FormControl>
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="assignmentDecreePath"
                        render={({field}) => (
                            <FormItem className="pb-4 border-b">
                                <div className="flex items-end xl:items-center justify-between gap-2">
                                    <FormLabel className="max-w-1/2 2xl:max-w-3/7">
                                        Mas'ul shaxs tayinlanganligi to‘g‘risida buyruq fayli
                                    </FormLabel>
                                    <FormControl>
                                        <InputFile form={form} {...field} />
                                    </FormControl>
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="expertisePath"
                        render={({field}) => (
                            <FormItem className="pb-4 border-b">
                                <div className="flex items-end xl:items-center justify-between gap-2">
                                    <FormLabel className="max-w-1/2 2xl:max-w-3/7">Ekspertiza loyihasi fayli</FormLabel>
                                    <FormControl>
                                        <InputFile form={form} {...field} />
                                    </FormControl>
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="installationCertPath"
                        render={({field}) => (
                            <FormItem className="pb-4 border-b">
                                <div className="flex items-end xl:items-center justify-between gap-2">
                                    <FormLabel className="max-w-1/2 2xl:max-w-3/7">Montaj guvohnomasi fayli</FormLabel>
                                    <FormControl>
                                        <InputFile form={form} {...field} />
                                    </FormControl>
                                </div>
                            </FormItem>
                        )}
                    />
                </CardForm>
                <Button type="submit" className="mt-5">
                    Ariza yaratish
                </Button>
            </form>
        </Form>
    );
};
