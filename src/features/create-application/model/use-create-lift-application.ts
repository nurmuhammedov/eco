import {useForm} from 'react-hook-form';
import {useCallback, useMemo} from 'react';
import {zodResolver} from '@hookform/resolvers/zod';
import {getSelectOptions} from '@/shared/lib/get-select-options';
import {
    applicationFormConstants,
    LifAppealDtoSchema,
    CreateLiftApplicationDTO,
    useCreateLiftApplicationMutations,
} from '@/entities/create-application';
import {
    useDistrictSelectQueries,
    useRegionSelectQueries,
} from '@/shared/api/dictionaries';

export const useCreateLiftApplication = () => {
    const form = useForm<CreateLiftApplicationDTO>({
        resolver: zodResolver(LifAppealDtoSchema),
    });

    const regionId = form.watch('regionId');

    const {spheres} = applicationFormConstants();

    const {data: regions} = useRegionSelectQueries();

    const {data: districts} = useDistrictSelectQueries(regionId);

    const districtOptions = useMemo(() => getSelectOptions(districts), [districts, regionId]);

    console.log(regionId)
    const regionOptions = useMemo(() => getSelectOptions(regions), [regions]);


    const {mutateAsync: createLiftApplication, isPending} = useCreateLiftApplicationMutations();


    const handleSubmit = useCallback(
        async (formData: CreateLiftApplicationDTO): Promise<boolean> => {
            try {
                const response = await createLiftApplication(formData);
                return response.success;
            } catch (error) {
                console.error('Lift application submission error:', error);
                return false;
            }
        },
        [createLiftApplication],
    );

    return {form, handleSubmit, isPending, spheres, regionOptions, districtOptions};
};
