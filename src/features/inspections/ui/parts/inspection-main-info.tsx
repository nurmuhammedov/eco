import { useInspectionDetail } from '@/features/inspections/hooks/use-inspection-detail.ts';
import DetailRow from '@/shared/components/common/detail-row.tsx';
import { getDate } from '@/shared/utils/date.ts';

const InspectionMainInfo = () => {
  const { data: inspectionData } = useInspectionDetail();
  if (!inspectionData) {
    return null;
  }

  return (
    <div>
      <DetailRow
        title="Tekshiruv sanasi:"
        value={getDate(inspectionData?.startDate) + ' - ' + getDate(inspectionData?.endDate)}
      />
      {inspectionData?.inspectors?.map((item: any, idx: number) => {
        return <DetailRow key={item.id} title={`Tekshiruvchi inspektor ${idx + 1}:`} value={item?.name} />;
      })}
    </div>
  );
};

export default InspectionMainInfo;
