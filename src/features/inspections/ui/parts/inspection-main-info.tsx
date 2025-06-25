import { useInspectionDetail } from '@/features/inspections/hooks/use-inspection-detail.ts';
import DetailRow from '@/shared/components/common/detail-row.tsx';
import { getDate } from '@/shared/utils/date.ts';
import FileLink from '@/shared/components/common/file-link.tsx';

const InspectionMainInfo = () => {
  const { data: inspectionData } = useInspectionDetail();
  if (!inspectionData) {
    return null;
  }

  return (
    <div>
      <DetailRow
        title="Tekshiruv reja jadvali:"
        value={!!inspectionData?.schedulePath ? <FileLink url={inspectionData?.schedulePath} /> : '-'}
      />
      <DetailRow
        title="Tekshiruv sanasi:"
        value={getDate(inspectionData?.startDate) + ' - ' + getDate(inspectionData?.endDate)}
      />
      {inspectionData?.inspectors?.map((item: any, idx: number) => {
        return <DetailRow key={item.id} title={`Tekshiruvchi inspektor ${idx + 1}:`} value={item?.name} />;
      })}

      <DetailRow title="Ombudsman maxsus kod:" value={inspectionData?.specialCode || '-'} />
      <DetailRow
        title="Tekshiruv buyrug‘i:"
        value={!!inspectionData?.decreePath ? <FileLink url={inspectionData?.decreePath} /> : '-'}
      />

      <DetailRow
        title="Xabardor qilish xati:"
        value={
          !!inspectionData?.notificationLetterPath ? <FileLink url={inspectionData?.notificationLetterPath} /> : '-'
        }
      />

      <DetailRow title="Xabardor qilish xati sanasi:" value={getDate(inspectionData?.notificationLetterDate) || '-'} />

      <DetailRow
        title="Buyurtma:"
        value={!!inspectionData?.orderPath ? <FileLink url={inspectionData?.orderPath} /> : '-'}
      />

      <DetailRow
        title="Tekshiruv dasturi:"
        value={!!inspectionData?.programPath ? <FileLink url={inspectionData?.programPath} /> : '-'}
      />

      <DetailRow
        title="Chora-tadbirlar:"
        value={!!inspectionData?.measuresPath ? <FileLink url={inspectionData?.measuresPath} /> : '-'}
      />

      <DetailRow
        title="Tekshiruv natijasi:"
        value={!!inspectionData?.resultPath ? <FileLink url={inspectionData?.resultPath} /> : '-'}
      />
    </div>
  );
};

export default InspectionMainInfo;
