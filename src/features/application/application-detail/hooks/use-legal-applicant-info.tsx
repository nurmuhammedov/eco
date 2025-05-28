import {useQuery} from '@tanstack/react-query';
import {applicationDetailApi} from '../model/application-detail.api.ts';

export const useLegalApplicantInfo = (id: any) => {
    return useQuery({
        queryKey: ['APLICANT_INFO', id],
        staleTime: 0,
        enabled: !!id,
        queryFn: () => applicationDetailApi.getLegalApplicantInfo(id),
    });
};
