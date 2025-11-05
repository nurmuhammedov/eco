// import { useInspectionDetail } from '@/features/inspections/hooks/use-inspection-detail.ts';
import DetailRow from '@/shared/components/common/detail-row.tsx';
import { getDate } from '@/shared/utils/date.ts';
import FileLink from '@/shared/components/common/file-link.tsx';
// import { useActDetail } from '@/features/inspections/hooks/use-act-detail.ts';
import SignersModal from '@/features/application/application-detail/ui/modals/signers-modal.tsx';
import { useState } from 'react';
import { Eye } from 'lucide-react';

const InspectionMainInfo = ({ inspectionData }: any) => {
  // const { data: inspectionData } = useInspectionDetail();
  // const { data: inspectionData?.act } = useActDetail();
  const [signers, setSigners] = useState<any[]>([]);

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
        value={!!inspectionData?.decree?.path ? <FileLink url={inspectionData?.decree?.path} /> : '-'}
      />
      <DetailRow title="Buyruq sanasi:" value={getDate(inspectionData?.decree?.createdAt) || '-'} />
      <DetailRow title="Buyruq raqami:" value={inspectionData?.decreeNumber || '-'} />

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
      <DetailRow
        title="Tilxat:"
        value={!!inspectionData?.acknowledgementPath ? <FileLink url={inspectionData?.acknowledgementPath} /> : '-'}
      />
      {!!inspectionData?.act && (
        <DetailRow
          title="Dalolatnoma:"
          value={
            !!inspectionData?.act?.path ? (
              <div className="flex items-center gap-2">
                <FileLink url={inspectionData?.act?.path} />
                <button
                  className="cursor-pointer hover:text-yellow-200 text-[#A6B1BB]"
                  onClick={() => {
                    setSigners(inspectionData?.act?.signers || []);
                  }}
                >
                  <Eye size="18" />
                </button>
              </div>
            ) : (
              '-'
            )
          }
        />
      )}
      <SignersModal setSigners={setSigners} signers={signers} />
    </div>
  );
};

export default InspectionMainInfo;
