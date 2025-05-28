import {useApplicantDocs} from "@/features/application/application-detail/hooks/use-applicant-docs.tsx";
import {ColumnDef} from "@tanstack/react-table";
import {ISearchParams} from "@/shared/types";

import {DataTable} from "@/shared/components/common/data-table";

const ApplicantDocsTable = () => {
    const {data} = useApplicantDocs()
    const columns: ColumnDef<ISearchParams>[] = [
        {
            accessorKey: 'date',
            maxSize: 100,
            header: 'Sana',
        },
        {
            accessorKey: 'documentType',
            maxSize: 100,
            header: 'Hujjat nomi',
        },
        {
            accessorKey: 'isSigned',
            maxSize: 100,
            header: 'Imzo holati',
        },
        {
            accessorKey: 'path',
            maxSize: 100,
            header: 'Hujjat nomi',
        },

    ];

    console.log(data)
    return (
        <DataTable
            isPaginated
            data={data || []}
            columns={columns as unknown as any}
            className="h-[calc(100svh-270px)]"
        />
    );
};

export default ApplicantDocsTable;