import {useQuery} from '@tanstack/react-query';
import {applicationDetailApi} from '../model/application-detail.api.ts';
import {useParams} from "react-router-dom";

export const useApplicantDocs = () => {
    const {id} = useParams();
    return useQuery({
        queryKey: ['APLICANT_DOCS', id],
        staleTime: 0,
        queryFn: () => applicationDetailApi.getApplicantDocs(id),
    });
};
