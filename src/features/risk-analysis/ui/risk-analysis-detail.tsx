import AppealMainInfo from '@/features/application/application-detail/ui/parts/appeal-main-info.tsx';
import FilesSection from '@/features/application/application-detail/ui/parts/files-section.tsx';
import LegalApplicantInfo from '@/features/application/application-detail/ui/parts/legal-applicant-info.tsx';
import { useFilesToFix } from '@/features/risk-analysis/hooks/use-files-to-fix.ts';
import { useObjectInfo } from '@/features/risk-analysis/hooks/use-object-info.ts';
// import RiskAnalysisChecklists from '@/features/risk-analysis/ui/parts/risk-analysis-checklists.tsx';
import RiskAnalysisFilesToFix from '@/features/risk-analysis/ui/parts/risk-analysis-files-to-fix.tsx';
// import RiskAnalysisIndicator from '@/features/risk-analysis/ui/parts/risk-analysis-info.tsx';
import { GoBack } from '@/shared/components/common';
import { DetailCardAccordion } from '@/shared/components/common/detail-card';
import DetailRow from '@/shared/components/common/detail-row.tsx';
import FileLink from '@/shared/components/common/file-link.tsx';
import { Coordinate } from '@/shared/components/common/yandex-map';
import YandexMap from '@/shared/components/common/yandex-map/ui/yandex-map.tsx';
import { getDate } from '@/shared/utils/date.ts';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/shared/hooks/use-auth';
import { ColumnDef } from '@tanstack/react-table';
// import { RiskAnalysisItem } from '@/entities/risk-analysis/models/risk-analysis.types';
//import RiskAnalysisInfo from '@ /features/risk-analysis/ui/parts/risk-analysis-info.tsx';
// import { AssignedStatusTab } from '@/widgets/risk-analysis/types';
// import { UserRoles } from '@/entities/user';
// import { AssignInspectorButton } from '@/features/risk-analysis/ui/assign-inspector-button';
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table';
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks';
import { format, formatDate } from 'date-fns';

const RiskAnalysisDetail = () => {
  const { data } = useObjectInfo();
  const navigate = useNavigate();
  const {
    paramsObject: { tin, id, type: ty, ...rest },
  } = useCustomSearchParams();
  const currentTin = tin;
  const objectId = id;
  let type = ty;
  const { data: filesToFix } = useFilesToFix();
  const { user } = useAuth();

  const { data: tableData = [], isLoading: isTableDataLoading } = usePaginatedData<any>(`/risk-analyses/belongings`, {
    ...rest,
    belongId: objectId,
    page: rest.page || 1,
    size: rest?.size || 10,
  });

  if (type !== 'hf' && type !== 'irs') {
    type = data?.type;
  }

  const currentBelongId = objectId; // Misol uchun
  const currentIntervalId = user.interval.id; // Misol uchun

  const currentObjLocation = data?.location?.split(',') || ([] as Coordinate[]);

  const handleView = (row: any) => {
    navigate(`/risk-analysis/info/${row.original.id}?tin=${tin}&name=${data?.legalName || data?.ownerName || ''}`);
  };

  const columns: ColumnDef<any>[] = [
    {
      header: 'Xavf tahlil davri',
      cell: ({ row }) =>
        `${formatDate(row.original.endDate, 'dd.MM.yyyy')} - ${formatDate(row.original.startDate, 'dd.MM.yyyy')}`,
    },
    {
      header: 'Inspektor',
      accessorKey: 'inspectorName',
    },
    {
      header: 'Jami bali',
      accessorKey: 'totalScore',
    },
    {
      header: 'Hudud',
      accessorKey: 'regionName',
    },
    {
      header: 'Ijobiylar soni',
      accessorKey: 'positiveCount',
    },
    {
      header: 'Salbiylar soni',
      accessorKey: 'negativeCount',
    },
    {
      header: 'Xavf tahlili o‘tkazilgan vaqt',
      cell: ({ row }) => `${format(row.original.createdAt || new Date(), 'dd.MM.yyyy HH:mm:ss')}`,
    },
    {
      id: 'actions',
      header: 'Amallar',
      cell: ({ row }) => <DataTableRowActions row={row} showView={true} onView={handleView} />,
    },
  ];

  if (!data) {
    return null;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <GoBack
          title={`Tashkilot: ${data?.legalName || data?.ownerName || ''} ${currentTin ? `(${currentTin})` : ''}`}
        />
      </div>
      <DetailCardAccordion
        defaultValue={[
          // 'org_info',
          // 'object_info',
          // 'files',
          // 'object_files',
          // 'object_location',
          // 'registry_info',
          // 'checklists',
          'risk_anlalysis_info',
        ]}
      >
        <DetailCardAccordion.Item value="risk_anlalysis_info" title="Xavfni tahlil qilish bo‘yicha ma’lumotlar">
          {currentBelongId && currentIntervalId ? (
            <>
              {/*<RiskAnalysisIndicator*/}
              {/*  belongId={currentBelongId}*/}
              {/*  intervalId={Number(currentIntervalId)} // Agar intervalId ham string bo'lsa, songa o'giramiz*/}
              {/*/>*/}
              <DataTable
                data={tableData || []}
                columns={columns}
                isLoading={isTableDataLoading}
                // className="h-[calc(100svh-270px)]"
              />
            </>
          ) : (
            <div>Kerakli ma'lumotlar topilmadi...</div> // Yoki loader ko'rsatish mumkin
          )}
        </DetailCardAccordion.Item>
        <DetailCardAccordion.Item value="registry_info" title="Reyestr ma’lumotlari">
          <DetailRow
            title="Reyestrga kiritish uchun asos (ariza):"
            value={
              data?.appealId ? (
                <Link className="text-[#0271FF]" to={'/applications/detail/' + data?.appealId}>
                  Arizani ko‘rish
                </Link>
              ) : (
                <span className="text-red-600">Mavjud emas</span>
              )
            }
          />
          <DetailRow title="Hisobga olish sanasi:" value={getDate(data?.registrationDate)} />
          <DetailRow title="Hisobga olish raqami:" value={data?.registryNumber} />
          {!!data?.registryFilePath && (
            <DetailRow title="Sertifikat fayli:" value={<FileLink url={data?.registryFilePath} />} />
          )}
          <DetailRow title="Reyestrdan chiqarish sanasi:" value={getDate(data?.deregisterDate)} />
          <DetailRow title="Reyestrdan chiqarish sababi:" value={getDate(data?.deregisterReason)} />
        </DetailCardAccordion.Item>
        <DetailCardAccordion.Item value="org_info" title="Tashkilot to‘g‘risida maʼlumot">
          <LegalApplicantInfo tinNumber={currentTin} />
        </DetailCardAccordion.Item>
        <DetailCardAccordion.Item value="object_info" title="Obyekt yoki qurilma to‘g‘risida ma’lumot">
          <AppealMainInfo data={data} type={type?.toUpperCase()} address={data?.address} />
        </DetailCardAccordion.Item>
        <DetailCardAccordion.Item value="object_files" title="Obyektga biriktirilgan fayllar">
          <FilesSection files={data?.files || []} />
        </DetailCardAccordion.Item>
        {!!currentObjLocation?.length && (
          <DetailCardAccordion.Item value="object_location" title="Obyekt yoki qurilma ko‘rsatilgan joyi">
            <YandexMap coords={[currentObjLocation]} center={currentObjLocation} zoom={16} />
          </DetailCardAccordion.Item>
        )}
        {filesToFix && filesToFix?.length > 0 && (
          <DetailCardAccordion.Item value="files" title="Xavfni tahlil etish uchun arizachi yuborgan ma’lumotlar">
            <RiskAnalysisFilesToFix data={filesToFix} />
          </DetailCardAccordion.Item>
        )}
        {/*<DetailCardAccordion.Item value="checklists" title="Cheklistlar">*/}
        {/*  <RiskAnalysisChecklists />*/}
        {/*</DetailCardAccordion.Item>*/}
        {/* <DetailCardAccordion.Item value="risk_anlalysis_info" title="Xavfni tahlil qilish bo‘yicha ma’lumotlar">
          <RiskAnalysisInfo />
        </DetailCardAccordion.Item> */}
      </DetailCardAccordion>
    </>
  );
};

export default RiskAnalysisDetail;
