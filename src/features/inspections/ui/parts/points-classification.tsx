import { riskAnalysisData } from '@/shared/constants/risk-analysis-data.ts';
import useCustomSearchParams from '../../../../shared/hooks/api/useSearchParams.ts';
import { useRiskAnalysisDetail } from '@/features/risk-analysis/hooks/use-risk-analysis-detail.ts';
import FileLink from '@/shared/components/common/file-link.tsx';

const PointsClassification = () => {
  const { paramsObject } = useCustomSearchParams();
  const currentCat = paramsObject?.type || '';
  const { data, isLoading, isError } = useRiskAnalysisDetail();
  const totalScore = data?.reduce((sum: any, item: any) => sum + (item.score ?? 0), 0) || 0;

  if (isLoading || isError) {
    return null;
  }

  return (
    <table className="text-left w-full border border-neutral-100 text-sm">
      <thead className="font-medium">
        <tr className="border border-neutral-100 p-4 bg-[#F9F9F9]">
          <th className="border border-neutral-100 p-4">№</th>
          <th className="border border-neutral-100 p-4">Baholash ko‘rsatkichlari</th>
          <th className="border border-neutral-100 p-4">ha/yo‘q</th>
          <th className="border border-neutral-100 p-4">Ball</th>
          <th className="border border-neutral-100 p-4">Fayl</th>
        </tr>
      </thead>
      {/*@ts-ignore*/}
      {riskAnalysisData[currentCat] &&
        //@ts-ignore
        riskAnalysisData[currentCat].map((item, idx) => {
          const paragraphName = `PARAGRAPH_${currentCat?.toUpperCase()}_${idx + 1}`;
          const currentItem = data?.find((item: any) => item.indicatorType === paragraphName);

          return (
            <tr className="border border-neutral-100 p-4 odd:bg-neutral-50" key={item?.title}>
              <td className="border border-neutral-100 p-4">{idx + 1}</td>
              <td className="border border-neutral-100 p-4">{item?.title}</td>
              <td className="border border-neutral-100 p-4">
                {currentItem && currentItem?.score !== 0 ? (
                  <span className="text-red-600">yoq</span>
                ) : (
                  <span className="text-green-600">ha</span>
                )}
              </td>
              <td className="border border-neutral-100 p-4">{currentItem?.score || 0}</td>
              <td className="border border-neutral-100 p-4">
                {!!currentItem?.filePath && <FileLink isSmall={true} url={currentItem?.filePath} />}
              </td>
            </tr>
          );
        })}
      <tfoot className="bg-[#DAE5FF] text-base font-medium">
        <tr>
          <td className="p-4" colSpan={3}>
            Jami:
          </td>
          <td className="p-4" colSpan={2}>
            {totalScore}
          </td>
        </tr>
      </tfoot>
    </table>
  );
};

export default PointsClassification;
