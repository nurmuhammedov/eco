import { DataTable, DataTableColumnHeader } from '@/shared/components/common/data-table';
import { createColumnHelper } from '@tanstack/react-table';
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks';

export const AccreditationConclusionList = () => {
  const {
    paramsObject: { ...rest },
  } = useCustomSearchParams();
  const { data = [], isLoading } = usePaginatedData<any>(`/accreditations/conclusions`, {
    ...rest,
    page: rest.page || 1,
    size: rest?.size || 10,
  });

  const columnHelper = createColumnHelper<any>();

  const expertiseConclusionColumns = [
    columnHelper.group({
      id: 'customerInfo',
      header: 'Buyurtmachi to‘g‘risida asosiy ma’lumotlar',
      columns: [
        columnHelper.accessor('customerLegalName', {
          header: ({ column }) => <DataTableColumnHeader column={column} title="Buyurtmachi tashkilotning nomi" />,
          cell: (info) => info.getValue() || 'Kiritilmagan',
        }),
        columnHelper.accessor('customerTin', {
          header: ({ column }) => <DataTableColumnHeader column={column} title="Buyurtmachi tashkilot STIR" />,
          cell: (info) => info.getValue() || 'Kiritilmagan',
        }),
        columnHelper.accessor('customerLegalAddress', {
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Buyurtmachi tashkilotning yuridik manzili" />
          ),
          cell: (info) => info.getValue() || 'Kiritilmagan',
        }),
        columnHelper.accessor('customerLegalForm', {
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Buyurtmachi tashkilotning tashkiliy-huquqiy shakli" />
          ),
          cell: (info) => info.getValue() || 'Kiritilmagan',
        }),
      ],
    }),
    columnHelper.group({
      id: 'expertiseInfo',
      header: 'Sanoat xavfsizligi ekspertizasi xulosasi to‘g‘risida ma’lumotlar',
      columns: [
        // columnHelper.accessor('spheres', {
        //   header: 'Sanoat xavfsizligi ekspertizasining yo‘nalishlari',
        //   cell: (info) => {
        //     const spheres = info.getValue();
        //     if (!spheres || spheres.length === 0) return 'Kiritilmagan';
        //     return spheres
        //       .map((sphereKey) => {
        //         const sphere = ACCREDITATION_SPHERE_OPTIONS.find((opt) => opt.value === sphereKey);
        //         return sphere ? sphere.name : sphereKey;
        //       })
        //       .join(', ');
        //   },
        //   size: 400,
        // }),
        columnHelper.accessor('expertiseConclusionNumber', {
          header: 'Xulosa raqami',
          cell: (info) => info.getValue() || 'Kiritilmagan',
        }),
        columnHelper.accessor('expertiseConclusionDate', {
          header: 'Xulosa sanasi',
          cell: (info) => info.getValue() || 'Kiritilmagan',
        }),
        columnHelper.accessor('expertiseObjectName', {
          header: 'Ekspertiza obyekti nomi',
          cell: (info) => info.getValue() || 'Kiritilmagan',
        }),
      ],
    }),
    // columnHelper.accessor('expertiseConclusionPath', {
    //   header: 'Hujjatlar',
    //   cell: (info) => {
    //     const path = info.getValue();
    //     if (!path) return 'Mavjud emas';
    //     return (
    //       <a href={path} target="_blank" rel="noopener noreferrer">
    //         <Button variant="outline" size="icon">
    //           <FileText className="h-4 w-4" />
    //         </Button>
    //       </a>
    //     );
    //   },
    // }),
    // columnHelper.display({
    //   id: 'actions',
    //   header: 'Amallar',
    //   cell: ({ row }) => (
    //     <Link to={row.original.id}>
    //       <Button variant="outline" size="icon">
    //         <Eye className="h-4 w-4" />
    //       </Button>
    //     </Link>
    //   ),
    //   size: 80,
    // }),
  ];

  return (
    <DataTable
      columns={expertiseConclusionColumns}
      data={data || []}
      showNumeration={false}
      isLoading={isLoading}
      className="h-[calc(100svh-220px)]"
    />
  );
};
