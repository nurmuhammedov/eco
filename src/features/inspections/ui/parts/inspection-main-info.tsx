import DetailRow from '@/shared/components/common/detail-row.tsx';
import { getDate } from '@/shared/utils/date.ts';
import FileLink from '@/shared/components/common/file-link.tsx';
import SignersModal from '@/features/application/application-detail/ui/modals/signers-modal.tsx';
import { useState } from 'react';
import { Eye } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';

const InspectionMainInfo = ({ inspectionData }: any) => {
  const [signers, setSigners] = useState<any[]>([]);

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

      <DetailRow
        title="Ombudsman maxsus kod:"
        value={<span style={{ color: 'green' }}>{inspectionData?.specialCode || '-'}</span>}
      />

      <DetailRow
        title="Tekshiruv buyrug‘i:"
        value={
          !!inspectionData?.decree?.path ? (
            <div className="flex items-center gap-2">
              <span>{getDate(inspectionData?.decree?.createdAt) || '-'}</span> |
              <span>{inspectionData?.decreeNumber || '-'}</span> |
              <FileLink url={inspectionData?.decree?.path} />
              <button
                className="cursor-pointer hover:text-yellow-200 text-[#A6B1BB]"
                onClick={() => {
                  setSigners(inspectionData?.decree?.signers || []);
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

      <DetailRow
        title="Xabardor qilish xati:"
        value={
          <div className="flex items-center gap-2">
            <span>Gibrid pochta holati: </span>
            <Badge variant="info" className="text-sm">
              Kelib tushdi
            </Badge>{' '}
            | <span>Yuborilgan sana: {getDate(inspectionData?.notificationLetterDate || new Date())}</span>
            {/*|<FileLink url={inspectionData?.notificationLetterPath} />*/}
          </div>
        }
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
